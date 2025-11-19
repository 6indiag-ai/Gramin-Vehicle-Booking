// script.js - Local + Backend Booking + Table + WhatsApp

const API_BASE = "https://gramin-backend-fixed.onrender.com";

(function(){
  function id(i){return document.getElementById(i)}

  // Save booking to Backend + LocalStorage
  async function saveBooking(){
    var name = id('name').value.trim()
    var mobile = id('mobile').value.trim()
    var pickup = id('pickup').value.trim()
    var drop = id('drop').value.trim()
    var vehicle = id('vehicle').value
    var date = id('date').value
    var time = id('time').value
    var passengers = id('passengers').value
    var luggage = id('luggage').value

    var tripEls = document.getElementsByName('trip')
    var trip = 'One-way'
    for(var i=0;i<tripEls.length;i++){
      if(tripEls[i].checked) trip = tripEls[i].value
    }

    if(!name || !mobile || !pickup || !drop || !vehicle || !date || !time){
      alert('Please fill all required fields.')
      return
    }

    var booking = { 
      name, mobile, pickup, drop, vehicle, date, time, passengers, luggage, trip 
    }

    // ---------- SAVE TO BACKEND ----------
    try {
      let res = await fetch(`${API_BASE}/api/book`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(booking)
      });

      let out = await res.json();

      if(res.ok){
        alert("Booking Saved to Server ✓ Booking ID: " + out.id);
      } else {
        alert("Server Error: " + out.message);
      }
    } catch(err){
      console.log(err);
      alert("Backend not reachable! Saving locally only.");
    }

    // ---------- ALSO SAVE TO LOCALSTORAGE ----------
    var list = JSON.parse(localStorage.getItem('gv_bookings')||'[]')
    list.push(booking)
    localStorage.setItem('gv_bookings', JSON.stringify(list))

    document.getElementById('bookingForm').reset()

    if(document.getElementById('tableBody')) populateTable()
  }

  // Populate booking table (from backend first → then local)
  async function populateTable(){
    var tableBody = id('tableBody')
    if(!tableBody) return
    tableBody.innerHTML = ''

    let list = [];

    // Try Backend first
    try{
      let res = await fetch(`${API_BASE}/api/bookings`);
      if(res.ok){
        list = await res.json();
      }
    } catch(e){
      console.log("Backend down → Showing local data");
    }

    // If backend empty → show local
    if(list.length === 0){
      list = JSON.parse(localStorage.getItem('gv_bookings') || '[]');
    }

    for(var i=0;i<list.length;i++){
      var b = list[i]
      var tr = document.createElement('tr')
      tr.innerHTML =
        '<td>'+escapeHtml(b.name)+'</td>'
        +'<td>'+escapeHtml(b.mobile)+'</td>'
        +'<td>'+escapeHtml(b.pickup)+'</td>'
        +'<td>'+escapeHtml(b.drop)+'</td>'
        +'<td>'+escapeHtml(b.vehicle)+'</td>'
        +'<td>'+escapeHtml(b.date)+'</td>'
        +'<td>'+escapeHtml(b.time)+'</td>'

      tableBody.appendChild(tr)
    }
  }

  // Clear bookings
  function clearBookings(){
    if(confirm('Clear all local bookings?')) {
      localStorage.removeItem('gv_bookings')
      populateTable()
    }
  }

  // Send booking info to WhatsApp
  function sendWhatsApp(){
    var name = id('name').value.trim()
    var mobile = id('mobile').value.trim()
    var pickup = id('pickup').value.trim()
    var drop = id('drop').value.trim()
    var vehicle = id('vehicle').value
    var date = id('date').value
    var time = id('time').value
    var passengers = id('passengers').value
    var luggage = id('luggage').value

    var tripEls = document.getElementsByName('trip')
    var trip = 'One-way'
    for(var i=0;i<tripEls.length;i++){ if(tripEls[i].checked) trip = tripEls[i].value }

    if(!name || !mobile || !pickup || !drop || !vehicle || !date || !time){
      alert('Please fill all required fields before sending to WhatsApp.')
      return
    }

    var message = encodeURIComponent(
      'Booking Request%0AName: ' + name +
      '%0AMobile: ' + mobile +
      '%0APickup: ' + pickup +
      '%0ADrop: ' + drop +
      '%0AVehicle: ' + vehicle +
      '%0ATrip: ' + trip +
      '%0ADate: ' + date +
      '%0ATime: ' + time +
      '%0APassengers: ' + passengers +
      '%0ALuggage(KG): ' + luggage
    )

    var phone = '91XXXXXXXXXX' // ← तुम अपना नंबर डाल देना
    var url = 'https://wa.me/' + phone + '?text=' + message
    window.open(url, '_blank')
  }

  function escapeHtml(text){
    if(!text) return ''
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  }

  document.addEventListener('DOMContentLoaded', function(){
    if(id('saveLocal')) id('saveLocal').addEventListener('click', saveBooking)
    if(id('sendWhatsApp')) id('sendWhatsApp').addEventListener('click', sendWhatsApp)
    if(id('clearStorage')) id('clearStorage').addEventListener('click', clearBookings)
    populateTable()
  })

  window.populateTable = populateTable

})();
