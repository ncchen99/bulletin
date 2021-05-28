// Global Variables
var user_data;
var docId;

function init_database() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyACHJIEEDVA7XiWztrYjili8iszNsAqMsg",
    authDomain: "graduation-bulletin-board.firebaseapp.com",
    projectId: "graduation-bulletin-board",
    storageBucket: "graduation-bulletin-board.appspot.com",
    messagingSenderId: "369892302318",
    appId: "1:369892302318:web:150fa2423b25e23a4642ff",
    measurementId: "G-T6DN3PTY4C",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

// html2canvas
function saveAs(uri, filename) {
  var link = document.createElement("a");
  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;
    //Firefox requires the link to be in the body
    document.body.appendChild(link);
    //simulate click
    link.click();
    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}

//dirty Code
function make_card(post) {
  return (
    `<div class="col-lg-6">
  <div class="testimonial-content-wrapper testimonial-active slick-initialized slick-slider">
      <div class="slick-track" style="opacity: 1;">
          <div class="single-testimonial slick-slide slick-current slick-active" data-slick-index="0"
              aria-hidden="false" tabindex="0">
              <div class="testimonial-text">
                  <p class="text" style="word-break: break-all;">` +
    post["content"] +
    `</p>
              </div>
              <div class="testimonial-author d-sm-flex justify-content-between">
                  <div class="author-info d-flex align-items-center">
                      <div class="author-image">
                          <img src="` +
    post["img"] +
    `" alt="author">
                      </div>
                      <div class="author-name media-body">
                          <h5 class="name">` +
    post["name"] +
    `</h5>
                          <span class="sub-title">` +
    post["email"] +
    `</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div> <!-- testimonial content wrapper -->
</div> <!-- end card -->`
  );
}

function make_send_card() {
  return `<div class="row justify-content-center" id="send_card">
  <div class="testimonial-content-wrapper testimonial-active slick-initialized slick-slider">
      <div class="slick-track" style="opacity: 1;">
          <div class="single-testimonial slick-slide slick-current slick-active my-send-card" data-slick-index="0"
              aria-hidden="false" tabindex="0">
              <div class="testimonial-text">
              <div class="form-input light-rounded-buttons ">
                  <button class="main-btn el-btn light-rounded-four my-send-btn" data-toggle="modal" data-target="#sendModal">
                    <span>
                    <i class="lni lni-cloud-upload"></i>
                    </span>
                  偶也要留言🔮</button>
                </div>
              </div>
          </div>
      </div>
  </div> <!-- testimonial content wrapper -->
</div> <!-- end card -->`;
}

// do not reflash
$("#send-form").submit(function () {
  return false;
});
$("#create-form").submit(function () {
  return false;
});

// screenshot
$("#save_img").click(function () {
  html2canvas(document.querySelector("#services")).then((canvas) => {
    saveAs(
      canvas
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream"),
      "whsh-bulletin-board.jpg"
    );
  });
});

// create action
$("#create-form > div.modal-footer > div > button:nth-child(2)").click(
  function () {
    var $inputs = $("#create-form :input");
    var values = {};
    var input_valid = true;
    $inputs.each(function () {
      // get all the inputs into an array.
      if (this.name != "") {
        if ($(this).val() != null && $(this).val() != "") {
          values[this.name] = $(this)
            .val()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        } else {
          alert("不能空白窩🥺");
          input_valid = false;
          return false;
        }
      }
    });
    if (!input_valid) return false;
    $(".preloader").fadeIn(200);
    console.log(values);
    var db = firebase.firestore();
    db.collection("users")
      .add({
        user: values["user"],
        post: [],
      })
      .then(function () {
        window.open("./?p=" + values["user"], "_self");
      })
      .catch((error) => {
        alert("創建失敗可能是資料酷爛掉或網路不佳🤒");
        console.log("Error store post: ", error);
        $(".preloader").fadeOut(200);
      });
    return false;
  }
);

// submit action
$("#send-form > div.modal-footer > div > button:nth-child(2)").click(
  function () {
    // old fasion load var from cookie
    // var user_data = JSON.parse(Cookies.get("user_data"));
    // var docId = Cookies.get("doc.id");

    // check submit input legal
    var $inputs = $("#send-form :input");
    const default_avatars = "./assets/images/user-1.png";
    var values = {};
    var input_valid = true;
    $inputs.each(function () {
      // get all the inputs into an array.
      if (this.name != "") {
        if ($(this).val() != null && $(this).val() != "") {
          values[this.name] = $(this)
            .val()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        } else {
          alert("每一格都要填窩🥺");
          input_valid = false;
          return false;
        }
      }
    });
    if (!input_valid) return false;

    //start animation meanwhile store data and display it
    values["img"] = default_avatars;
    $(".preloader").fadeIn(200);
    user_data["post"].push(values);

    // reset Form
    $(this).closest("form").find("input, textarea").val("");
    // store Cookie
    Cookies.set("user_data", JSON.stringify(user_data));

    //store to firestore
    var db = firebase.firestore();
    db.collection("users")
      .doc(docId)
      .update({
        post: firebase.firestore.FieldValue.arrayUnion(values),
      })
      .then(function () {
        $(".preloader").fadeOut(200);
      })
      .catch((error) => {
        alert("儲存失敗可能是資料酷爛掉或網路不佳🤒");
        console.log("Error store post: ", error);
        $(".preloader").fadeOut(200);
      });
    $("#send_card").remove();
    var innerHTML = `<div class="row justify-content-center">`;
    for (var post_idx in user_data["post"]) {
      var post = user_data["post"][post_idx];
      innerHTML += make_card(post);
    }
    innerHTML += "</div>" + make_send_card();
    $("#board").html(innerHTML);
    $("#sendModal").modal("hide");
  }
);

// create btn click!
$("").click(function () {});

(function () {
  "use strict";
  $(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var user = urlParams.get("p");
    console.log(user);

    // init Firebase
    init_database();

    var db = firebase.firestore();

    if (user == null || user == "") {
      $("#text_under_title").text("\u00A0\u00A0快來創建自己的留言板🚀");
      $(".preloader").fadeOut(200);
    } else {
      // query user data
      db.collection("users")
        .where("user", "==", user)
        .get()
        .then((querySnapshot) => {
          //sucess query data
          var legal_user = false;
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // one user match query
            legal_user = true;
            user_data = doc.data();
            docId = doc.id;
            Cookies.set("doc.id", doc.id);
            Cookies.set("user_data", JSON.stringify(user_data));

            $("#title").text(user_data["user"] + "的🏠");

            $("#first_card").remove();
            var innerHTML = `<div class="row justify-content-center">`;
            for (var post_idx in user_data["post"]) {
              var post = user_data["post"][post_idx];
              innerHTML += make_card(post);
            }
            innerHTML += "</div>" + make_send_card();
            $("#board").html(innerHTML);
            $(".preloader").fadeOut(200);
          });
          if (!legal_user) {
            alert("書入的網址可能不正確🙁");
            $("#text_under_title").text("\u00A0\u00A0快來創建自己的留言板🚀");
            $(".preloader").fadeOut(200);
          }
        })
        .catch((error) => {
          $(".preloader").fadeOut(200);
          alert("程式裡面粗問題🥺");
          console.log("Error getting documents: ", error);
          $(".preloader").fadeOut(200);
        });
    }
  });
})();
