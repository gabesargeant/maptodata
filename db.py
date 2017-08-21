"""
This is the DB connector, Connect to the DB
"""
import mysql.connector

DB_CONFIG = {
    'user':'root',
    'database':'Census16',
    'password':'dovetail',
    'charset':'utf8',
    'use_unicode':True
}

def get_db_conn():
    """
    Get a connection to the DB
    """
    conn = mysql.connector.connect(**DB_CONFIG)

    return conn
