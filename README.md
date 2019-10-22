# Toronto Area Resources

**An app to help families and individuals research areas in Toronto.**

----------------------------------------------------------------------

It's simple: 

1. Enter an address to zoom to that position on a map

1. Toggles allow users to display different markers on the map representing important community resources, like schools, libraries, and community centres.

1. Markers can be clicked on to reveal details of the place in question.

-------------------------------------------------------------------------------------------

*The app allows one to better visualize what it might be like to live in different areas of Toronto. This can be especially beneficial to newcomers trying to familiarize themselves with an area, or families considering their options for schools and recreational centres.*

-------------------------------------------------------------------------------------------

**Technologies Used:**

- Bulma CSS framework
- Open Toronto APIs
- MapBox API

-------------------------------------------------------------------------------------------
**Acknowledgements**

***Images Credit***

Book map pin:
- Icons made by https://www.flaticon.com/authors/freepik

School map pin: 
- Author: https://www.flaticon.com/authors/itim2101
- Downloaded from https://www.flaticon.com

School map pin: 
- Author: https://www.flaticon.com/authors/itim2101
- Downloaded from https://www.flaticon.com

CN Tower:
- Author: https://www.flaticon.com/authors/smalllikeart
- Downloaded from www.flaticon.com

***Code Credit***

Some of this code was built on top of the example from Mapbox:
- https://docs.mapbox.com/help/tutorials/building-a-store-locator/

***Latitude and Longitude calculation Credit***

To set the search area for Toronto we needed to pass a bounding box to MapBox.

Calculate the Bounding box for Toronto in degrees:
https://boundingbox.klokantech.com/
			
Convert the bounding box degrees to lat and lon:
https://www.engineeringtoolbox.com/latitude-longitude-d_1371.html		
			
That is the northwest and southeast corner of the bounding box.
Mapbox needs the southwest and northeast corner. Use Google maps to confirm the coordinates: 
https://www.google.com/maps/place/43%C2%B051'19.0%22N+79%C2%B006'47.0%22W/@43.8552637,-79.1830983,12z/data=!4m5!3m4!1s0x0:0x0!8m2!3d43.855278!4d-79.113056?hl=en
			


-------------------------------------------------------------------------------------------
**Future Considerations:**

- include more complete reference information within marker menus. Information like Hours of Operation, Phone Number, and a URL to that individual place's domain.

- go past our limited scope with the inclusion of curated and in depth information about the places:

	- for schools, statistics and comparison tools ala Maclean's school rankings.

	- for community centres and libraries, a view to their bulletin items, which may inform on camps, clubs or events. A list of their amenities for easy reference.

-------------------------------------------------------------------------------------------

**Get Involved!**

If you think that our choices matter, then you're like us!
We know that a little bit of research can go a long way.
Our app is about being informed.

So help improve on a useful project!
Make the city easy and accessible!
Allow Torontonians to better benefit from their community resources!

- link to GitHub repo: https://github.com/ruthtech/torontoAreaResources
- link to deployed GitHub Page: https://ruthtech.github.io/torontoAreaResources/

-------------------------------------------------------------------------------------------

**Thank you!**

*Sincerely, Ruth, Billy, and Steven*

