$('#search-form, #about-page').hide()
$(document).ready(function () {
  function showSearchForm () {
    $('#search-form').slideDown()
    $('#search-btn-container').addClass('active')
  }

  function hideSearchForm () {
    $('#search-form').slideUp()
    $('#search-btn-container').removeClass('active')
  }

  function showAboutPage () {
    $('#about-page').slideDown()
    $('#about-btn-container').addClass('active')
  }

  function hideAboutPage () {
    $('#about-page').hide()
    $('#about-btn-container').removeClass('active')
  }

  // SEARCH BUTTON:
  $('#search-btn').click(function () {
    if ($('#search-btn-container').hasClass('active')) {
      hideSearchForm()
    } else {
      hideAboutPage()
      $('main').show()
      showSearchForm()
    }
  })

  // On ENTER keypress: Search Input + Wiki API:
  $('#search-input').on('keypress', function (e) {
    if (e.keyCode === 13) {
      // Clean the Wiki Cards Holder inner HTML:
      document.getElementById('wiki-cards-holder').innerHTML = ''
      let searchInput = document.getElementById('search-input').value
      // API Call:
        // Test Link: https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=hello&format=json
      let APIlink = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srsearch=' + searchInput + '&format=json'
      $.ajax(APIlink, {
        dataType: 'json',
        data: {
          origin: '*'
        },
        type: 'GET',
        success: function (json) {
          // Total Pages Badge Result:
          document.getElementById('results-container').innerHTML = '<span class="new badge blue" data-badge-caption="articles" id="results">' + json.query.searchinfo.totalhits + '</span>'
          // Inject the Wiki Cards, each one with their content, in the Wiki Cards Holder inner HTML:
          for (let i = 0; i < json.query.search.length; i++) {
            let pageNameWikiLink = json.query.search[i].title.replace(/\s/g, '_')
            document.getElementById('wiki-cards-holder').innerHTML += '<a href="" onclick="newPopUp(\'' + pageNameWikiLink + '\'); return false;">' +
                                                                        '<div class="col m12">' +
                                                                          '<article class="card horizontal z-depth-2 hoverable magictime vanishIn">' +
                                                                            '<div class="card-content">' +
                                                                              '<div class="card-title">' +
                                                                                '<h4 id="wiki-title">' + json.query.search[i].title + '</h4>' +
                                                                              '</div>' +
                                                                              '<p class="wiki-content">' + json.query.search[i].snippet + '</p>' +
                                                                            '</div>' +
                                                                          '</article>' +
                                                                        '</div>' +
                                                                      '</a>'
          }
        }
      })
    }
  })

  // ABOUT BUTTON:
  $('#about-btn').click(function () {
    if ($('#about-btn-container').hasClass('active')) {
      hideAboutPage()
      $('main').show()
    } else {
      $('main').hide()
      hideSearchForm()
      showAboutPage()
    }
  })
})

// Wikipedia Page Pop-Up:
function newPopUp (pageNameWikiLink) {
  document.getElementById('iframe-popup').innerHTML = '<article class="magictime swashIn" id="iframe-container">' +
                                                        '<div class="blue" id="iframe-title">' +
                                                          '<a href="https://en.wikipedia.org/wiki/' + pageNameWikiLink + '" target="_blank" role="button" class="btn waves-effect waves-light left blue lighten-1">Open External</a>' +
                                                          '<a href="" onclick="closePopUp(); return false;" class="btn-floating waves-effect waves-circle waves-light red lighten-1 right" role="button"><i class="material-icons">close</i></a>' +
                                                        '</div>' +
                                                        '<div id="window-iframe-container">' +
                                                          '<iframe name="Wikipedia Page" src="https://en.wikipedia.org/wiki/' + pageNameWikiLink + '" frameborder="0" align="middle" sandbox></iframe>' +
                                                        '</div>' +
                                                      '</article>'
}

function closePopUp () {
  $('#iframe-container').removeClass('swashIn').addClass('swashOut')
  // Delay of the cleaning of the inner HTML, to give time for the animation to take place:
  setTimeout(() => {
    document.getElementById('iframe-popup').innerHTML = ''
  }, 1000)
}
