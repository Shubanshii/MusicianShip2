function createCampaign() {
  let dataURI;
  $('#file-id').on('change', function(e) {
    console.log('working');

    //
    const file = e.currentTarget.files[0],
      reader = new FileReader();

    // if(file.size > 500000)
    // { alert('File Size must be less than .5 megabytes'); return false; }


    reader.addEventListener('load', () =>
    {
      //
      // preview.src = reader.result;
      // uriVal.value = reader.result;
      console.log(reader.result);
      dataURI = reader.result;
    }, false);

    if(file)
    { reader.readAsDataURL(file); }
  });


  $.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    o.files = dataURI;
    console.log(this);
    console.log(o);
    return o;
};
  $(".create-campaign-form").submit(function(event) {

    let postObject = JSON.stringify($('.create-campaign-form').serializeObject())

    $.ajax({
      type: "POST",
      url: "/campaigns",
      data: JSON.stringify($('.create-campaign-form').serializeObject()),
      success: function(){},
      dataType: "json",
      contentType: "application/json"
    });

    event.preventDefault();
  });
}



//  on page load do this
$(function() {
	// getAndDisplayCampaigns();
  // displayCampaigns();
  // addContribution();
  createCampaign();
  // getFinancialInfo(displayFiles);
})
