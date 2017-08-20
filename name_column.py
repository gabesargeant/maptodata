"""
This is a wrapper for pulling in a 500kb json dict and making it avalible to
the views as needed, its quicker to have 500kb in RAM than do a query againts
the db for this. It is what it is.
"""
import json

#column names
with open('./app/name_column.json') as data_file:
    COL_NAME_DICT = json.load(data_file)


#Column names for ajax. Not really huge but easier than the continious 
# ajax calls.

with open('./app/static/json/01.json') as data_file:
    JSON_1 = json.load(data_file)

with open('./app/static/json/02.json') as data_file:
    JSON_2 = json.load(data_file)

with open('./app/static/json/03.json') as data_file:
    JSON_3 = json.load(data_file)

with open('./app/static/json/04.json') as data_file:
    JSON_4 = json.load(data_file)

with open('./app/static/json/05.json') as data_file:
    JSON_5 = json.load(data_file)

with open('./app/static/json/06.json') as data_file:
    JSON_6 = json.load(data_file)

with open('./app/static/json/07.json') as data_file:
    JSON_7 = json.load(data_file)

with open('./app/static/json/08.json') as data_file:
    JSON_8 = json.load(data_file)

with open('./app/static/json/09.json') as data_file:
    JSON_9 = json.load(data_file)

with open('./app/static/json/10.json') as data_file:
    JSON_10 = json.load(data_file)

with open('./app/static/json/11.json') as data_file:
    JSON_11 = json.load(data_file)

with open('./app/static/json/12.json') as data_file:
    JSON_12 = json.load(data_file)

with open('./app/static/json/13.json') as data_file:
    JSON_13 = json.load(data_file)

with open('./app/static/json/14.json') as data_file:
    JSON_14 = json.load(data_file)

with open('./app/static/json/15.json') as data_file:
    JSON_15 = json.load(data_file)

with open('./app/static/json/16.json') as data_file:
    JSON_16 = json.load(data_file)

with open('./app/static/json/17.json') as data_file:
    JSON_17 = json.load(data_file)

with open('./app/static/json/18.json') as data_file:
    JSON_18 = json.load(data_file)

with open('./app/static/json/19.json') as data_file:
    JSON_19 = json.load(data_file)

with open('./app/static/json/20.json') as data_file:
    JSON_20 = json.load(data_file)

with open('./app/static/json/21.json') as data_file:
    JSON_21 = json.load(data_file)

with open('./app/static/json/22.json') as data_file:
    JSON_22 = json.load(data_file)

with open('./app/static/json/23.json') as data_file:
    JSON_23 = json.load(data_file)

with open('./app/static/json/24.json') as data_file:
    JSON_24 = json.load(data_file)

with open('./app/static/json/25.json') as data_file:
    JSON_25 = json.load(data_file)

with open('./app/static/json/26.json') as data_file:
    JSON_26 = json.load(data_file)

with open('./app/static/json/27.json') as data_file:
    JSON_27 = json.load(data_file)

with open('./app/static/json/28.json') as data_file:
    JSON_28 = json.load(data_file)

with open('./app/static/json/29.json') as data_file:
    JSON_29 = json.load(data_file)

with open('./app/static/json/30.json') as data_file:
    JSON_30 = json.load(data_file)

with open('./app/static/json/31.json') as data_file:
    JSON_31 = json.load(data_file)

with open('./app/static/json/32.json') as data_file:
    JSON_32 = json.load(data_file)

with open('./app/static/json/33.json') as data_file:
    JSON_33 = json.load(data_file)

with open('./app/static/json/34.json') as data_file:
    JSON_34 = json.load(data_file)

with open('./app/static/json/35.json') as data_file:
    JSON_35 = json.load(data_file)

with open('./app/static/json/36.json') as data_file:
    JSON_36 = json.load(data_file)

with open('./app/static/json/37.json') as data_file:
    JSON_37 = json.load(data_file)

with open('./app/static/json/38.json') as data_file:
    JSON_38 = json.load(data_file)

with open('./app/static/json/39.json') as data_file:
    JSON_39 = json.load(data_file)


def get_name_column_dict():
    """
    return the column name dictionary
    """
    return COL_NAME_DICT


def get_json_columns(col_num):
    """
    Python doesn't have a switch statement....thanks S.O for the assit
    https://stackoverflow.com/a/60211
    """
    return {
        '01': JSON_1,
        '02': JSON_2,
        '03': JSON_3,
        '04': JSON_4,
        '05': JSON_5,
        '06': JSON_6,
        '07': JSON_7,
        '08': JSON_8,
        '09': JSON_9,
        '10': JSON_10,
        '11': JSON_11,
        '12': JSON_12,
        '13': JSON_13,
        '14': JSON_14,
        '15': JSON_15,
        '16': JSON_16,
        '17': JSON_17,
        '18': JSON_18,
        '19': JSON_19,
        '20': JSON_20,
        '21': JSON_21,
        '22': JSON_22,
        '23': JSON_23,
        '24': JSON_24,
        '25': JSON_25,
        '26': JSON_26,
        '27': JSON_27,
        '28': JSON_28,
        '29': JSON_29,
        '30': JSON_30,
        '31': JSON_31,
        '32': JSON_32,
        '33': JSON_33,
        '34': JSON_34,
        '35': JSON_35,
        '36': JSON_36,
        '37': JSON_37,
        '38': JSON_38,
        '39': JSON_39,
    }[col_num]
