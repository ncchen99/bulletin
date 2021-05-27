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
  return `<div class="row justify-content-center">
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
      db.collection("data")
        .where("user", "==", user)
        .get()
        .then((querySnapshot) => {
          var legal_user = false;
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            legal_user = true;
            var user_data = doc.data();
            console.log(doc.id, " => ", user_data);
            $("#title").text(user_data["user"] + "的🏠");
            $("#first_card").html(
              `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
            );
            $(".preloader").fadeOut(200);
            var innerHTML = `<div class="row justify-content-center">`;
            for (var post_idx in user_data["post"]) {
              var post = user_data["post"][post_idx];
              innerHTML += make_card(post);
            }
            innerHTML += "</div>" + make_send_card();
            $("#board").html(innerHTML);
            $("#first_card").remove();
          });
          if (!legal_user) {
            alert("書入的網址可能不正確🙁");
            $(".preloader").fadeOut(200);
          }
        })
        .catch((error) => {
          $(".preloader").fadeOut(200);
          alert("程式裡面粗問題🥺");
          console.log("Error getting documents: ", error);
        });
    }
  });
})();
