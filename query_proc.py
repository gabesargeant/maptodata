"""
This is the main work of the show for the views
"""

import re
from mysql.connector import Error
from . import db

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
    (min / 5 = step)
    This is just hear in case i want to get more exotic with the breaks.
    Like jenks etc
    """

    step = min_max[1] / 5

    return step
