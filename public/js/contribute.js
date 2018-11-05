function addContribution() {
  $( ".contribution-form" ).submit(function( event ) {
    // MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal = MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal - $(".amount").val();
    // alert( MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal );
    $(location).attr('href');

	//pure javascript
	var pathname = window.location.pathname;
  var id = pathname.slice(11, 35)
  console.log(id);
  var amount = $(".amount").val();
  var dataObject = {
    amount,
    campaignId: id
  };



  console.log(JSON.stringify(dataObject));
  $.ajax({
    type: "POST",
    url: '/contributions',
    data: JSON.stringify(dataObject),
    success: function(){},
    dataType: "json",
    contentType: "application/json"
  });

	// to show it in an alert window
    // alert(window.location);
    // getFinancialInfo(displayFiles);
    event.preventDefault();
  });
}

$(function() {

  addContribution();
  // getFinancialInfo(displayFiles);
})
