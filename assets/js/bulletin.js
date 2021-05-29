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

// do not reflash
$("#send-form").submit(function () {
  return false;
});
$("#create-form").submit(function () {
  return false;
});

// copy popover auto hide
$("#create-form button:nth-child(1)").on("shown.bs.popover", function () {
  setTimeout(function () {
    $("#create-form button:nth-child(1)").popover("hide");
  }, 2000);
});
// screenshot
$("#save_page").click(function () {
  $(".navbar-area.sticky").css({ padding: "0" });
  window.print();
  $(".navbar-area.sticky").css({ padding: "10px 0" });
  // old school screencapture
  //   html2canvas(document.querySelector("#services")).then((canvas) => {
  //     saveAs(
  //       canvas
  //         .toDataURL("image/jpeg")
  //         .replace("image/jpeg", "image/octet-stream"),
  //       "whsh-bulletin-board.jpg"
  //     );
  //   });
});

// input error
function show_error_input(selector, error_message, original_message) {
  $(selector).removeClass("default").addClass("error");
  $(selector + " input")
    .val("")
    .blur()
    .attr("placeholder", error_message);
  $(selector + " input").focus(function () {
    $(selector).removeClass("error").addClass("default");
    $(selector + " input").attr("placeholder", original_message);
  });
}
// create btn click!
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
          var invalid_str = ["+", "&", "="];
          if (invalid_str.some((v) => $(this).val().includes(v))) {
            show_error_input(
              "#create-form .input-items",
              "這個名字不行🥺",
              "名字不能忘記窩🥺"
            );
            input_valid = false;
            return false;
          }
        } else {
          show_error_input(
            "#create-form .input-items",
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
            "#create-form .input-items",
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
                .val(
                  window.location.href.split("?")[0] + "?p=" + values["user"]
                )
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
        console.log(
          "Error checking duplicate or create new user data: ",
          error
        );
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
          // todo change alret to input error
          input_valid = false;
          return false;
        }
      }
    });
    if (!input_valid) return false;

    //start animation meanwhile store data and display it
    values["img"] =
      "./assets/images/user/user-" + (getRandomInt(5) + 1) + ".png";
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
  }
);

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
