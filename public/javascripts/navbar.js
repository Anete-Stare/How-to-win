(function(){
    document.scroll(function(){
        const nav = document.querySelector('#mainNavbar');
        nav.toggleClass('scrolled', this.scrollTop()>nav.height());

    })
})


