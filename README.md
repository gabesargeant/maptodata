This is a map based visualization tool that allows you to use a map to select areas in Australia and look at Census data that relates to those areas. Each field is also able to be visualized to show general break down of where in the selected area those fields occur.

A few things. 

1. This is a flask application. Written in python usuing the flask framework for the server side logic. 
2. The DB is a mysql db. Its 1.6 gig and has  around 60million cells to it. That was built using the census datapacks from the Australian Bureau of Statistics.
3. Why mysql? It does reads well and this is a read only applications.
4. If anyone ever reads this and wants to build on this or extend or chop it up. To get it running all you need to do is created a python3 virtual evn. Install flask and grab the mysql connector.
5. The db may be in another repo, and the code is pretty tightly coupled to the db I created and that was a design choice as I was more interested in the query and display of this data then the creation of a generalized map visualization database schema.

I will update this will more content. Over time. And alo imbed a FAQ etc in on the page if when I throw it up.

-Gabriel Sargeant.

