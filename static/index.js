window.onload = () => {
  $("#results").hide()
  var slider = document.getElementById("confidence")
  console.log(slider.value)
  $("#sendbutton").click(() => {
    console.log(slider.value)
    imagebox = $("#imagebox");
    link = $("#link");
    input = $("#imageinput")[0];
    if (input.files && input.files[0]) {
      let formData = new FormData();
      formData.append("video", input.files[0]);
      formData.append("conf", slider.value )
      console.log(formData.entries)
      $.ajax({
        url: "/detect", // fix this to your liking
        type: "POST",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        error: function (data) {
          console.log("upload error", data);
          console.log(data.getAllResponseHeaders());
        },
        success: function (data) {
          $.ajax({
            url : "static/labels/result.txt",
            dataType: "text",
            success : function (dataa) {
                $("#results").show()
                $("#results").text(dataa);
                console.log(dataa)
            } 
          });
          console.log(data);
          //show_image(data, 480, 480, Sign);
          // bytestring = data["status"];
          // image = bytestring.split("'")[1];
          $("#image").attr("src", "static/" + data, "href", "static/" + data);
          $("#img_download").attr("href", "static/" + data);
          
        },
      });
      
    }
  });
  $("#opencam").click(() => {
    console.log("evoked openCam");
    $.ajax({
      url: "/opencam",
      type: "GET",
      error: function (data) {
        console.log("upload error", data);
      },
      success: function (data) {
        console.log(data);
      }
    });
  })
  $('#imageinput').on('change', function(event) {

    if (
      !event ||
      !event.target ||
      !event.target.files ||
      event.target.files.length === 0
    ) {
      return;
    }
  
    const fileUrl = window.URL.createObjectURL(event.target.files[0]);
    const imgExtensions = ['jpg', 'png'];
    const videoExtensions = ['mkv', 'mp4', 'webm'];
    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
  
    const ext = name.substring(lastDot + 1);
    
    $("#results").hide()
    if (imgExtensions.includes(ext)) {
      $("#video").hide(); // hide video preview
      $("#image").show().attr("src", fileUrl);
    } else if (videoExtensions.includes(ext)) {
      $("#image").hide(); // hide image preview
      $("#video").show().attr("src", fileUrl);
    }
  });
};

function readUrl(input) {
  imagebox = $("#imagebox");
  console.log(imagebox);
  console.log("evoked readUrl");
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = function (e) {
      console.log(e.target);

      imagebox.attr("src", e.target.result);
      $('#image').attr('src', e.target.result);
      //   imagebox.height(500);
      //   imagebox.width(800);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function openCam(e){
  console.log("evoked openCam");
  e.preventDefault();
  console.log("evoked openCam");
  console.log(e);
}



$('#imageinput').on('change', function(event) {

  if (
    !event ||
    !event.target ||
    !event.target.files ||
    event.target.files.length === 0
  ) {
    return;
  }

  const fileUrl = window.URL.createObjectURL(event.target.files[0]);
  const imgExtensions = ['jpg', 'png'];
  const videoExtensions = ['mkv', 'mp4', 'webm'];
  const name = event.target.files[0].name;
  const lastDot = name.lastIndexOf('.');

  const ext = name.substring(lastDot + 1);

  if (imgExtensions.includes(ext)) {
    $("#video").hide(); // hide video preview
    $("#image").show().attr("src", fileUrl);
  } else if (videoExtensions.includes(ext)) {
    $("#image").hide(); // hide image preview
    $("#video").show().attr("src", fileUrl);
  }
});
