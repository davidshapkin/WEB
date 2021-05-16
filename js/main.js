$(document).ready(() =>{
  $("#button").on("click", function (e) {
    name = $("#name")[0].value;
    mark = $("#mark")[0].value;
    if (name.length > 0){
      line = $("<tr><td>" + name + "</td><td>" + mark + "</td><tr>");
      $("tbody").append(line);
    }else{
      alert("Имя не может быть пустым");
    }
  });
});
