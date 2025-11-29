const form = document.getElementById('contactForm');
const response = document.querySelector('.form-response');

form.addEventListener('submit', function(e){
  e.preventDefault();
  response.textContent = "Thank you! Your message has been sent.";
  response.style.color = "#00eaff";
  form.reset();
});
