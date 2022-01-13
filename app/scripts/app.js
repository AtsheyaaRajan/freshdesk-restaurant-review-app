

var recommendationData;

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();
  function renderApp() {
    var onInit = app.initialized();
    onInit.then(getClient).catch(handleErr);
    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
    }
    console.log(recommendationData);
  }
};

function onAppActivate() {
  var getContact = client.data.get('contact');
  getContact.then(showContact).catch(handleErr);
  var location;
  function showContact(payload) {
    location = payload.contact.custom_fields.city;
    location = location.split(" ").join("");
    console.log("in show contact");
    document.body.getElementsByClassName("btn btn-primary")[0].innerHTML = `Food in ${payload.contact.custom_fields.city}`;
    var searchReco = function() {
     // var self = this,
        this,
        // path = "/",
        headers = { Authorization: "Bearer yx_b9oSJrnPgRfxNS5F4vYWlcYXVFA1tYjqDqnpe_KZ1ur9EY_SApQUju6fM1o64-NGFZHCCtOeEbSiUGOWwSetejEeIAo8StQ-Ya2osUoBZgW1yDiJ34d6dwjzXYXYx"},
        reqData = { headers: headers, isOAuth: true },
        url = "https://api.yelp.com/v3/businesses/search?location="+location;
      client.request.get(url, reqData).then(
        function(data) {
          recommendationData = JSON.parse(data.response);
          for(var i=0;i<recommendationData.businesses.length;i++){
            if(recommendationData.businesses[i].review_count > 50 && recommendationData.businesses[i].rating >= 4.0 ){
            var listElement = document.createElement("LI");
            listElement.innerHTML = recommendationData.businesses[i].name +" ";
            var divElement = document.createElement("DIV");
            divElement.style.fontWeight = 'bold'
            divElement.innerHTML = "Rating : "+ recommendationData.businesses[i].rating ;
            divElement.setAttribute("font-weight","bold");
            listElement.appendChild(divElement);
            listElement.className = "list-group-item";
            document.body.getElementsByTagName("ul")[0].appendChild(listElement);
            console.log(recommendationData.businesses[i].name);
            }
          }
        },

        function(error) {
          console.log(error)
        }
      );
    }
    searchReco();
  }
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}


