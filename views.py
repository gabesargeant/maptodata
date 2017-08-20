"""
This is the views handler for the Census 2016 map based data lookup tool
"""
import re
from flask import render_template, request, json, jsonify
from app import app
from mysql.connector import Error
from . import db
from . import name_column

@app.route('/')
@app.route('/index')
def index():
    """
    This is the index handler, looks up the db columns, presents them. and
    nothing else
    """
    columns = fetch_columns()

    return render_template('index.html', title='Find places on a map!', columns=columns)

@app.route('/_get_columns', methods=['GET'])
@app.route('/index/_get_columns', methods=['GET'])
def get_columns():
    """
    This handles an ajax request for extra columsn to view data.
    """
    col_no = request.args.get('col_no', 0, type=str)
    print(col_no)
    result = name_column.get_json_columns(col_no)
    print("getting this far")
    return jsonify(result=result)

def fetch_columns():
    """
    Fetches the columns for index() module
    """
    conn = db.get_db_conn()
    cur = conn.cursor()
    query = "SELECT columnKey, shortHeader, longHeader, tableLookUp FROM \
     nameToColumn where  tableLookup=%s  OR tableLookup=%s ORDER BY columnKey"
    args = ('c01', 'c02')
    #print(args)
    cur.execute(query, args)
    rows = cur.fetchall()
    ##
    cur.close()
    conn.close()

    return rows

@app.route("/data", methods=['POST'])
def data():
    """
    This does a ton of work
    1. it lints the columns, 2. its then looks up the tables that the columns
    belong to. 3. it then builds a query for the data and then gets that data
    """
    columns = request.form.getlist('columns')
    regions = request.form.getlist('fieldsArr')
    #print(regions)
    #for the visualization step, a copy of the 'RAW' regions.
    raw_regions = regions

    regions = regions[0].split(',')

    #catch if region is empty, should not be if the client hasn't modified
    #client side code
    reg_len = len(regions)
    if reg_len == 1:
        regions = ['AUS_CODE_2016,036']
        raw_regions = 'AUS_CODE_2016,036'
    #regions are split into a list and columns are a list, time to enfore
    # limits! up to 100 columns by 1000 cells max!
    if len(columns) > 10:
        columns = columns[:10]

    #extra 1 for the regions code yet to be extracted
    if len(regions) > 1001:
        regions = regions[:1001]

    area = regions[0]

    #check for no slected data itme and return a total pop count
    col_len = len(columns)
    if col_len == 0:
        columns.append('Tot_P_P')

    # bigly work,
    r_data = table_query(regions, columns)

    columns.insert(0, area)
    columns.insert(0, "Census 2016 Name")

    return render_template('data.html',
                           title='Data from the map',
                           data=r_data,
                           columns=columns,
                           raw_regions=raw_regions)


def table_query(regions, columns):
    """
    This does all the queries for the data displayed on the /data page
    0. lint table columns
    1. get tables that columns belong to
    2. build placeholders
    3. build query
    4. exec query
    5. return data
    """
    try:
        conn = db.get_db_conn()
        cur = conn.cursor()

        cols = prep_column_look_up(len(columns))

        query = "SELECT DISTINCT(tableLookUp) FROM nameToColumn WHERE " + cols
        #print(query)
        #mysql lints the columns parameters
        cur.execute(query, columns)
        rslt = cur.fetchall()

        tables = ['codeToNames']
        for rs1 in rslt:
            tables.append(rs1[0])

        #creating tables and columns
        t_tables = table_names_builder(tables)
        c_columns = column_name_builder(columns)

        del regions[0] #removes first element as not a region
        reg_len = len(regions)
        if reg_len == 0:
            regions.append('036')

        r_regions = regions_statement_builder(len(regions))
        query = "SELECT Census_Name_2016, region, " + c_columns + " FROM " \
        + t_tables + " WHERE " + r_regions

        cur.execute(query, regions)

        return_data = cur.fetchall()

    except Error as ex:
        print(ex)

    finally:
        cur.close()
        conn.close()

    return return_data

def table_names_builder(names):
    """
    Lints the columns to ensure they are comprised of only the characters that
    make valid mysql headers. This prevents againts injection, Had to do this
    as there is a current bug with the mysql connector that does not allow for
    parameterization of columns or tables. Probs will switch to a diff DB,
    maybe! But I have spent enough time building the current thingo.
    """
    tables = " {} "
    i = 1
    while i < len(names):
        tables = tables + " NATURAL JOIN {}"
        i = i + 1

    tables = tables.format(*names)
    tables = tables.replace('\'', '')
    tables = tables.replace('[', '')
    tables = tables.replace(']', '')
    tables = tables.replace('(', '')
    tables = tables.replace(')', '')
    tables = tables.replace(',', '')

    return tables


def column_name_builder(columns):
    """
    Lints the columns to ensure they are comprised of only the characters that
    make valid mysql headers. This prevents againts injection, Had to do this
    as there is a current bug with the mysql connector that does not allow for
    parameterization of columns or tables. Probs will switch to a diff DB,
    maybe! But I have spent enough time building the current version
    """
#Regex validates that the statement doesn't include anything like ;
# to avoid injection
    column_name_validator = re.compile(r'^[0-9a-zA-Z_\$]+$')
    #
    for col in columns:
        if not column_name_validator.match(col):
            raise ValueError('Hey!  No SQL injecting allowed!')

    c_columns = str(columns)
    c_columns = c_columns.replace('\'', '')
    c_columns = c_columns.replace(']', '')
    c_columns = c_columns.replace('[', '')
    #print(columns)


    return c_columns


def prep_column_look_up(num):
    """
    Preps the column look up to create a variable set of shortHeader = %s
    """
    cols = "shortHeader = %s "

    i = 1
    while i < num:
        cols = cols + " OR shortHeader = %s"
        i = i + 1
    return cols

def regions_statement_builder(num):
    """
    Preps the region var to create a variable set of region = %s
    """
    regions = "region = %s "

    i = 1
    while i < num:
        regions = regions + " OR region = %s"
        i = i + 1

    return regions


@app.route("/visualise", methods=['POST'])
def visualise():
    """
    This does the visualization, It provide a page with a result set of two
    compones 1, an in value. And a linked region. This will be jamed into a
    json object in a script tag for the esri tag to visualise
    """

    column = request.form.getlist('columnName')
    regions = request.form.getlist('raw_regions')
    #take the single string and return a list
    regions = prep_regions(regions)
    #get that tables of interst
    table = column_to_table(column)

    var_data = get_region_data(table, column, regions)
    minval = get_region_data_min(table, column, regions)
    maxval = get_region_data_max(table, column, regions)

    #column diction to get human fiendly designation
    column_dict = name_column.get_name_column_dict()
    real_column = column_dict[column[0]]


    ##packing for the template
    region = regions[0]
    min_max = [minval, maxval]
    step = calc_steps(min_max)
    min_max.append(step)

    min_max = json.dumps(min_max)
    json_vardata = json.dumps(var_data)

    return render_template('visualise.html',
                           title='Data on a Map!',
                           column=column,
                           real_column=real_column,
                           region=region,
                           min_max=min_max,
                           json_vardata=json_vardata)

@app.route("/visualise", methods=['GET'])
def visualise_get():
    """
    The intent here is to have a get request just return a map of the
    Total POP of the STATES

    """
    column = "ninja this is a GET request"
    return render_template('visualise.html',
                           title='Data on a Map!',
                           column=column)

@app.route("/data", methods=['GET'])
def back_home():
    """
    The intent here is to have a get request just return a table of the
    Total POP of the STATES

    """
    column = "ninja this is a GET request"
    return render_template('data.html',
                           title='Data on a Map!',
                           column=column)

def column_to_table(column):
    """
    This takes a column and returns the table it belongs too. That is all
    Input list of 1 element, the column, return a tuple of 1 table.
    """
    try:
        conn = db.get_db_conn()
        cur = conn.cursor()

        #cols is only allows to be one thing. so
        column = column[:1]
        query = "SELECT tableLookUp FROM nameToColumn WHERE shortHeader = %s"
        cur.execute(query, column)

        table = cur.fetchall()

    except Error as ex:
        print(ex)

    finally:
        cur.close()
        conn.close()

    return table

def prep_regions(regions):
    """
    takes the regions and strips a few things out of them and then returns
    a list of regions.
    """
    str_regions = str(regions[0])
    str_regions = str_regions.replace('[', '')
    str_regions = str_regions.replace(']', '')
    str_regions = str_regions.replace('\"', '')
    str_regions = str_regions.replace('\'', '')

    regions = [str_regions]
    regions = regions[0].split(',')

    return regions

def get_region_data(table, column, regions):
    """
    Take a table, column and region composes a query to get the data for that
    column. This is just a simpler version of the get data from the /data page
    this returns a two objects, 1 the region:value pair and a min/max pair.
    """
    vardata = ((),)
    try:
        placeholders = prep_region_placeholders(len(regions))

        conn = db.get_db_conn()
        cur = conn.cursor()

        table = table_names_builder(table)
        column = column_name_builder(column)

        query = "SELECT region, " + column + " FROM " + table +" WHERE " \
        + placeholders


        #skips the region code
        cur.execute(query, regions[1:])

        vardata = cur.fetchall()

    except Error as ex:
        print(ex)

    finally:
        cur.close()
        conn.close()

    return vardata

def prep_region_placeholders(num):
    """
    Returns a variable region = %s for the where component of the query.
    The array starts with a geocode, then values
    """

    placeholder = "region = %s"

    if num > 1:
        i = 2
        while i < num:
            placeholder = placeholder + " OR region = %s"
            i = i + 1


    return placeholder


def get_region_data_max(table, column, regions):
    """
    Take a table, column and region composes a query to get the max value for
    that column. This is just a simpler version of the get data from the data
    page this returns a min value
    """
    vardata = ((),)
    try:
        placeholders = prep_region_placeholders(len(regions))

        conn = db.get_db_conn()
        cur = conn.cursor()

        table = table_names_builder(table)
        column = column_name_builder(column) 
        query = "SELECT max(" + column + ") FROM " + table +" WHERE " \
        + placeholders

        #print(query)
        #skips the region code

        cur.execute(query, regions[1:])
        vardata = cur.fetchone()
        return_val = str(vardata[0])
        return_val = int(return_val)

    except Error as ex:
        print(ex)

    finally:
        cur.close()
        conn.close()

    return return_val

def get_region_data_min(table, column, regions):
    """
    Take a table, column and region composes a query to get the max value for
    that column. This is just a simpler version of the get data from the data
    page this returns a min value
    """
    vardata = ((),)
    try:
        placeholders = prep_region_placeholders(len(regions))

        conn = db.get_db_conn()
        cur = conn.cursor()

        table = table_names_builder(table)
        column = column_name_builder(column)
        #print("table is " + table)
        query = "SELECT min(" + column + ") FROM " + table +" WHERE " \
        + placeholders

        #print(query)
        #skips the region code

        cur.execute(query, regions[1:])
        vardata = cur.fetchone()
        return_val = str(vardata[0])
        return_val = int(return_val)
    except Error as ex:
        print(ex)

    finally:
        cur.close()
        conn.close()

    return return_val

def calc_steps(min_max):
    """
    (max - min / 5 = step)
    """
    min_i = min_max[0]
    max_i = min_max[1]

    tmp = max_i - min_i
    #5 steps
    step = tmp / 5

    return step
