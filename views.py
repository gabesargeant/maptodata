"""
This is the views handler for the Census 2016 map based data lookup tool
"""
from flask import render_template, request, json, jsonify
from app import app
from . import name_column
from . import query_proc

@app.route('/')
@app.route('/index')
def index():
    """
    This is the index handler, looks up the db columns, presents them. and
    nothing else
    """

    return render_template('index.html', title='Find places on a map!')

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
    r_data = query_proc.table_query(regions, columns)

    columns.insert(0, area)
    columns.insert(0, "Census 2016 Name")

    return render_template('data.html',
                           title='Data from the map',
                           data=r_data,
                           columns=columns,
                           raw_regions=raw_regions)


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
    regions = query_proc.prep_regions(regions)
    #get that tables of interst
    table = query_proc.column_to_table(column)

    var_data = query_proc.get_region_data(table, column, regions)
    minval = query_proc.get_region_data_min(table, column, regions)
    maxval = query_proc.get_region_data_max(table, column, regions)

    #column diction to get human fiendly designation
    column_dict = name_column.get_name_column_dict()
    real_column = column_dict[column[0]]


    ##packing for the template
    region = regions[0]
    min_max = [minval, maxval]
    step = query_proc.calc_steps(min_max)
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
