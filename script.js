// script.js - handles saving booking locally and populating table
(function(){
  // Utility to read DOM
  function id(i){return document.getElementById(i)}

  // Save booking to localStorage
  function saveBooking(){
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
      alert('Please fill all required fields.')
      return
    }

    var booking = { name, mobile, pickup, drop, vehicle, date, time, passengers, luggage, trip, created: new Date().toISOString() }

    var list = JSON.parse(localStorage.getItem('gv_bookings')||'[]')
    list.push(booking)
    localStorage.setItem('gv_bookings', JSON.stringify(list))
    alert('Booking saved locally. You can view it in Bookings page.')
    document.getElementById('bookingForm').reset()
    // if on bookings page, refresh table
    if(document.getElementById('tableBody')) populateTable()
  }

  // Populate booking table from storage
  function populateTable(){
    var tableBody = id('tableBody')
    if(!tableBody) return
    tableBody.innerHTML = ''
    var list = JSON.parse(localStorage.getItem('gv_bookings')||'[]')
    for(var i=0;i<list.length;i++){
      var b = list[i]
      var tr = document.createElement('tr')
      tr.innerHTML = '<td>'+escapeHtml(b.name)+'</td>'
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
    if(confirm('Clear all bookings from this browser?')) {
      localStorage.removeItem('gv_bookings')
      populateTable()
    }
  }

  // Send booking summary to WhatsApp
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

    // Replace with your number including country code (example: 919812345678)
    var phone = '91XXXXXXXXXX'
    var url = 'https://wa.me/' + phone + '?text=' + message
    window.open(url, '_blank')
  }

  // Safe text escape
  function escapeHtml(text){
    if(!text) return ''
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  }

  // Attach events if elements exist
  document.addEventListener('DOMContentLoaded', function(){
    if(id('saveLocal')) id('saveLocal').addEventListener('click', saveBooking)
    if(id('sendWhatsApp')) id('sendWhatsApp').addEventListener('click', sendWhatsApp)
    if(id('clearStorage')) id('clearStorage').addEventListener('click', clearBookings)
    populateTable()
  })

  // Expose populateTable to global for manual calls (if needed)
  window.populateTable = populateTable

})();
