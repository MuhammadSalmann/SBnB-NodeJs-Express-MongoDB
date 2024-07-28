(function () {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
          form.classList.add('was-validated')
        }, false)
      })
  })()

  // Tax info switch
  document.getElementById('flexSwitchCheckDefault').addEventListener('change', () => {
    let taxInfo = document.querySelectorAll('.tax-info');
    taxInfo.forEach((tax) => {
        if (tax.style.display === 'inline') {
            tax.style.display = 'none';
        } else {
            tax.style.display = 'inline';
        }
    });
});