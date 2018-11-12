// console.log('working');

var pathname = window.location.pathname;
var id = pathname.slice(11, 35);

function getFinancialGoal(callback) {
  // console.log('getgoal working');
  const settings = {
    type: "GET",
    url: '/financialgoal/' + id,
    dataType: "json",
    success: callback
  };
  $.ajax(settings);
  // url: GITHUB_SEARCH_URL,
  //   data: {
  //     q: `${searchTerm} in:name`,
  //     per_page: 5
  //   },
  //   dataType: 'json',
  //   type: 'GET',
  //   success: callback
}

function displayFiles(data) {
  let contributionTotal = 0;
  console.log('financialGoal', data.financialGoal);
  console.log('contributions', data.contributions[0].amount);
  for (let i = 0; i < data.contributions.length; i++) {
    contributionTotal += data.contributions[i].amount;
  }
  console.log('contributionTotal', contributionTotal);
  if (contributionTotal >= data.financialGoal) {
    // console.log('comparison working');
    $('.files').append(`<p>${data.files}</p>`);
  }
}

function addContribution() {
  // console.log('add cont working');
  $(".contribution-form").submit(function(event) {
    // console.log('form working');

    // console.log(id);
    var amount = $('.amount').val();
    var dataObject = {
      amount,
      campaignId: id
    };
    // console.log(dataObject);
    // console.log(JSON.stringify(dataObject));
    $.ajax({
      type: "POST",
      url: '/contributions',
      data: JSON.stringify(dataObject),
      success: function(){},
      dataType: "json",
      contentType: "application/json"
    });

    getFinancialGoal(displayFiles);
    event.preventDefault();
  });
}



// function addContribution() {
//   $( ".contribution-form" ).submit(function( event ) {
//     // MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal = MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal - $(".amount").val();
//     // alert( MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal );
//     $(location).attr('href');
//
// 	//pure javascript
// 	var pathname = window.location.pathname;
//   var id = pathname.slice(11, 35)
//   console.log(id);
//   var amount = $(".amount").val();
//   var dataObject = {
//     amount,
//     campaignId: id
//   };
//   console.log(JSON.stringify(dataObject));
//   $.ajax({
//     type: "POST",
//     url: '/contributions',
//     data: JSON.stringify(dataObject),
//     success: function(){},
//     dataType: "json",
//     contentType: "application/json"
//   });
//
// 	// to show it in an alert window
//     // alert(window.location);
//     // getFinancialInfo(displayFiles);
//     event.preventDefault();
//   });
//
//
// function getFinancialInfo() {
//   console.log('getFinancialInfo working');
// }
//
// function updateFinancialGoal() {
//   console.log('update func working');
//   $( ".contribution-form" ).submit(function( event ) {
//     getFinancialInfo();
//     MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal = MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal - $(".amount").val();
//     alert( MOCK_CAMPAIGN_INFO.campaigns[1].financialGoal );
//     event.preventDefault();
//   });
// }
function deleteCampaign() {
  $('.delete-button').on('click', function(e) {
    $.ajax({
      type: "DELETE",
      url: '/campaigns/' + id,
      success: function(){},
      dataType: "json",
      contentType: "application/json"
    });
  });
}

$(function() {

    addContribution();
    deleteCampaign();
    // getFinancialGoal();
    // getFinancialInfo(displayFiles);
})
