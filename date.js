exports.getDate=function(){
const currentDate = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const dateString = currentDate.toLocaleDateString('en-US', options);
return dateString;
}
exports.getDay=function(){
const currentDate = new Date();
const options = { weekday: 'long'};
const dateString = currentDate.toLocaleDateString('en-US', options);
return dateString;
}