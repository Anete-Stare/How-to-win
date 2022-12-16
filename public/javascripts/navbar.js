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


