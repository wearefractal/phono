var opt = {
  proxy: "app:9990013298"
};

var phone = phono.createClient("f12dc371538c973b3cb200b43b6c594d", opt);

phone.on("message", function(msg) {
  console.log(msg);
});

phone.ready(function(){
  console.log("connected");
  console.log("my number is", phone.number());

  phone.message(phone.number(), "Hey");

  window.call = phone.call("480-252-5373");

  call.on("ring", function(){
    console.log("ring");
  });

  call.on("answer", function(){
    console.log("answer");
  });

  call.on("hangup", function(){
    console.log("hangup");
  });

});