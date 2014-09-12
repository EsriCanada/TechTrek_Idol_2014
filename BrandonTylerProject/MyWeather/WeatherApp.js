
			$(document).ready(function() {
			
				
				var city = "Ottawa";
				
				var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + '&mode=json&units=metric&cnt=16';
					
					$.getJSON(url,function(Result){
						l = Result.list;						
						l.forEach(logArrayElements);
					});	
					
				var day = 0;
				
				function logArrayElements(element, index, array) {					
					if (index == day) {document.getElementById("FirstdayDiv").innerHTML = "Day Temp = " + element.temp.day}
				}
			
			});
		