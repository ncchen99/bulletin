// Global Variables
var user_data;
var docId;
var fb_user_data = {};

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

function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  console.log("statusChangeCallback");
  console.log(response); // The current login status of the person.
  if (response.status === "connected") {
    // Logged into your webpage and Facebook.
    testAPI();
  } else {
    // Not logged into your webpage or we are unable to tell.
    document.getElementById("status").innerHTML =
      "Please log " + "into this webpage.";
    console.log("Please log " + "into this webpage.");
  }
}

function checkLoginState() {
  // Called when a person is finished with the Login Button.
  FB.getLoginStatus(function (response) {
    // See the onlogin handler
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function () {
  FB.init({
    appId: "1209542359498398",
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: "v10.0", // Use this Graph API version for this call.
  });

  FB.getLoginStatus(function (response) {
    // Called after the JS SDK has been initialized.
    statusChangeCallback(response); // Returns the login status.
  });
};

function getUserProfileImg(userId) {
  console.log("Fetching your img... ");
  FB.api(
    "/" + userId + "/picture",
    "GET",
    { redirect: "false", height: 200, width: 200 },
    function (response) {
      getImg(response["data"]["url"]);
    }
  );
}

function getImg(val) {
  fb_user_data["img"] = val;
  console.log(fb_user_data);
}

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log("Welcome!  Fetching your information.... ");
  FB.api("/me?fields=email,name", function (response) {
    fb_user_data = response;
    $("#fb_input").html(
      `
        <div class="contact-wrapper form-style-two">
          <div class="row">
            <div class="col-md-12">
              <div class="form-input">
                <label>😻留言內容</label>
                <div class="input-items default">
                  <textarea name="fb_content" placeholder="以` +
        response.name +
        `的身份留言"></textarea>
                  <i class="lni lni-pencil-alt"></i>
                </div>
              </div>
              <!-- form input -->
            </div>
          </div>
          <!-- row -->
        </div>`
    );
    FB.api(
      "/" + fb_user_data.id + "/picture",
      "GET",
      { redirect: "false", height: 200, width: 200 },
      function (response) {
        fb_user_data.img = response["data"]["url"];
        console.log(fb_user_data);
      }
    );
  });
}

//get random int
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
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
                  <div class="author-info d-flex align-items-center"><div class="author-image">
                          <img src="` +
    post["img"] +
    `" alt="author">
                        </div>
                        <div class="author-name media-body">
                            <h5 class="name mt-10">` +
    ("fb" in post
      ? `<a class="my-a card-author-name" href="` + post["fb"] + `">`
      : `<a class="my-a card-author-name" href="mailto:` +
        post["email"] +
        `">`) +
    post["name"] +
    `</a> </h5>
                            <span class="sub-title">` +
    ("time" in post ? post["time"] : post["email"]) +
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
//===== choos gender
// dropdown item onclick
function choose_avatar(gender) {
  if (gender == "boy")
    $("#dropdownMenuButton")
      .removeClass("girl")
      .addClass("boy")
      .text("👦 男生");
  else
    $("#dropdownMenuButton")
      .removeClass("boy")
      .addClass("girl")
      .text("👧 女生");
}

// do not reflash
$("#send-form").submit(function () {
  return false;
});
$("#create-form").submit(function () {
  return false;
});
$("#enter-form").submit(function () {
  return false;
});

// copy popover auto hide
$("#create-form button:nth-child(1)").on("shown.bs.popover", function () {
  setTimeout(function () {
    $("#create-form button:nth-child(1)").popover("hide");
  }, 2000);
});

// old school screencapture
//   html2canvas(document.querySelector("#services")).then((canvas) => {
//     saveAs(
//       canvas
//         .toDataURL("image/jpeg")
//         .replace("image/jpeg", "image/octet-stream"),
//       "whsh-bulletin-board.jpg"
//     );
//   });

$("#share_page").click(function () {
  navigator.clipboard.writeText(window.location.href).then(
    function () {
      $("#share_page").text(" 已複製 ");
      $("#share_page").css({
        "border-color": "#25eb00",
        "background-color": "#25eb00",
      });
      setTimeout(function () {
        $("#share_page").html('複製 <i class="lni lni-link"></i>');
        $("#share_page").css({ "border-color": "", "background-color": "" });
      }, 2000);
    },
    function (err) {
      $("#share_page").text("複製失敗");
      setTimeout(function () {
        $("#share_page").html('複製 <i class="lni lni-link"></i>');
      }, 2000);

      console.error("Async: Could not copy text: ", err);
    }
  );
});

// input error
function show_error_input($selector, error_message, original_message) {
  $selector.removeClass("default").addClass("error");
  $selector
    .children("input, textarea")
    .val("")
    .blur()
    .attr("placeholder", error_message);
  $selector.children("input, textarea").focus(function () {
    $selector.removeClass("error").addClass("default");
    $selector.children("input,textarea").attr("placeholder", original_message);
  });
}

// enter btn click
$("#enter-form button:nth-child(2)").click(function () {
  var input = $("#enter-form :input")[0]; //get input dom obj
  console.log(input);
  var value;
  if ($(input).val() != null && $(input).val() != "") {
    value = $(input).val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var invalid_str = ["+", "&", "="];
    if (invalid_str.some((v) => $(input).val().includes(v))) {
      show_error_input(
        $("#enter-form .input-items"),
        "找不到這個人的留言板🥺",
        "嗨嗨🌞"
      );
      return false;
    }
  } else {
    show_error_input(
      $("#enter-form .input-items"),
      "名字不能空白窩🥺",
      "嗨嗨🌞"
    );
    return false;
  }
  window.open("./?p=" + value, "_self");
});

// create btn click!
$("#create-form button:nth-child(2)").click(function () {
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
        var invalid_str = ["+", "&", "="];
        if (invalid_str.some((v) => $(this).val().includes(v))) {
          show_error_input(
            $("#create-form .input-items"),
            "這個名字不行🥺",
            "名字不能忘記窩🥺"
          );
          input_valid = false;
          return false;
        }
      } else {
        show_error_input(
          $("#create-form .input-items"),
          "名字不能空白窩🥺",
          "名字不能忘記窩🥺"
        );
        input_valid = false;
        return false;
      }
    }
  });
  if (!input_valid) return false;
  $(".preloader").fadeIn(100);
  var db = firebase.firestore();

  db.collection("users")
    .where("user", "==", values["user"])
    .get()
    .then((querySnapshot) => {
      //sucess query data
      querySnapshot.forEach((doc) => {
        input_valid = false;
      });
      if (!input_valid) {
        $(".preloader").fadeOut(100);
        //user already exist
        console.log("user already exist");
        show_error_input(
          $("#create-form .input-items"),
          "這個名字已經有人使用過惹🥺",
          "名字不能忘記窩🥺"
        );
      } else {
        // new user!
        console.log("new user!!");
        db.collection("users")
          .add({
            user: values["user"],
            post: [],
          })
          .then(function () {
            $(".preloader").fadeOut(100);
            $("#create-form label").text("🚀尼ㄉ專屬留言板網址");
            $("#create-form .input-items")
              .removeClass("default")
              .addClass("success")
              .css({ "border-color": "#4da422", color: "#4da422" });

            $("#create-form .input-items i")
              .removeClass("lni lni-user")
              .addClass("lni lni-chrome");
            $("#create-form .input-items input")
              .val(window.location.href.split("?")[0] + "?p=" + values["user"])
              .prop("disabled", true);
            $("#create-form button:nth-child(1)").html(
              '<span class="lni lni-share"></span>複製'
            );
            $("#create-form button:nth-child(1)").attr(
              "data-toggle",
              "popover"
            );
            $("#create-form button:nth-child(1)").attr(
              "data-placement",
              "bottom"
            );
            $("#create-form button:nth-child(1)").click(function () {
              navigator.clipboard
                .writeText(
                  window.location.href.split("?")[0] + "?p=" + values["user"]
                )
                .then(
                  function () {
                    $("#create-form button:nth-child(1)").attr(
                      "title",
                      "複製成功"
                    );
                    $("#create-form button:nth-child(1)").attr(
                      "data-content",
                      "趕快去分享吧！"
                    );
                    $("#create-form button:nth-child(1)").popover();
                  },
                  function (err) {
                    $("#create-form button:nth-child(1)").attr(
                      "title",
                      "複製失敗"
                    );
                    $("#create-form button:nth-child(1)").attr(
                      "data-content",
                      "複製的功能只能用Chromeㄛ"
                    );
                    $("#create-form button:nth-child(1)").popover();

                    console.error("Async: Could not copy text: ", err);
                  }
                );
            });
            $("#create-form button:nth-child(1)").removeAttr("data-dismiss");

            $("#create-form button:nth-child(2)").html(
              '<span class="lni lni-car"></span>前往'
            );
            $("#create-form button:nth-child(2)").attr("type", "button");
            $("#create-form button:nth-child(2)").attr(
              "onclick",
              "location.href='" + "./?p=" + values["user"] + "';"
            );
            // window.open("./?p=" + values["user"], "_self");
          });
      }
    })
    .catch((error) => {
      alert("創建失敗可能是資料酷爛掉或網路不佳🤒");
      console.log("Error checking duplicate or create new user data: ", error);
      $(".preloader").fadeOut(200);
    });
  return false;
});

// submit action
$("#send-form button:nth-child(2)").click(function () {
  // old fasion load var from cookie
  // var user_data = JSON.parse(Cookies.get("user_data"));
  // var docId = Cookies.get("doc.id");

  var $inputs = $("#send-form :input");
  var values = {};
  var input_valid = true;
  if ($("#tabs-icons-text-2-tab").hasClass("active")) {
    //fb mode
    $inputs.each(function () {
      // get all the inputs into an array.
      if (this.name == "fb_content") {
        if ($(this).val() != null && $(this).val() != "") {
          values["content"] = $(this)
            .val()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        } else {
          show_error_input(
            $(this).parent(".input-items"),
            "這格不能空白窩🥺",
            $(this).attr("placeholder")
          );
          // todo change alret to input error
          input_valid = false;
          return false;
        }
      }
    });
    values["name"] = fb_user_data.name;
    values["fb_id"] = fb_user_data.id;
    values["img"] = fb_user_data.img;
    values["email"] = fb_user_data.email;
  } else {
    // traditional mode
    $inputs.each(function () {
      // get all the inputs into an array.
      if (this.name != "" && this.name != "fb_content") {
        if ($(this).val() != null && $(this).val() != "") {
          values[this.name] = $(this)
            .val()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        } else {
          show_error_input(
            $(this).parent(".input-items"),
            "這格不能空白窩🥺",
            $(this).attr("placeholder")
          );
          // todo change alret to input error
          input_valid = false;
          return false;
        }
      }
    });
    if ($("#dropdownMenuButton").hasClass("boy"))
      values["img"] = "./assets/images/user/user-boy-512px.jpg";
    else values["img"] = "./assets/images/user/user-girl-512px.jpg";
  }
  // check submit input legal

  if (!input_valid) return false;

  //start animation meanwhile store data and display it
  // values["img"] = "./assets/images/user/user-" + (getRandomInt(5) + 1) + ".png";
  var d = new Date();
  values["time"] =
    d.getFullYear() + "年 " + (d.getMonth() + 1) + "月 " + d.getDate() + "日";
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
});

//render all cards
function render_all_cards(user) {
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
          $("#text_under_title").text("\u00A0快來創建自己的留言板🚀");
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
}

(function () {
  "use strict";
  $(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var user = urlParams.get("p");
    console.log("hello " + user);
    // init Firebase
    init_database();

    render_all_cards(user);
  });
})();
