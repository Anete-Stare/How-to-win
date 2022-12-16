const navbar = document.querySelector('#mainNavbar')
const links =document.querySelectorAll('.nav-link')

        window.onscroll = function () {
            // pageYOffset or scrollY
            if (window.scrollY > navbar.scrollHeight) {
                navbar.classList.add('scrolled')
                links.forEach(v=> {
                    v.classList.add('scrolled')
                })
            } else {
                navbar.classList.remove('scrolled')
                links.forEach(v=>{
                    v.classList.remove('scrolled')
                })
            }
        }

const toggle = document.querySelector('.navbar-toggler')
const list = document.querySelector('#navbarNav')

window.onclick = function() {
    if(toggle.onclick===true){
        list.classList.add('test')
    } else{
      list.classList.remove('test')
    }
}