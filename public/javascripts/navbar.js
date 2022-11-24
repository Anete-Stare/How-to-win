

const navbar = document.querySelector('#mainNavbar')
        window.onscroll = function () {
            // pageYOffset or scrollY
            if (window.scrollY > navbar.scrollHeight) {
                navbar.classList.add('scrolled')
            } else {
                navbar.classList.remove('scrolled')
            }
        }

