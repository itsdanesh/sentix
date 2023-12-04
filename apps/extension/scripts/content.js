console.log("Extension Started!")

init()

function init() {
    new MutationObserver(() => { }).observe(document.body, { childList: true, subtree: true })
    setInterval(updateTwitterClasses, 800)
}

var lastAppliedTwitterUrl = null
var counter = 0

function updateTwitterClasses() {
    if (location.href != lastAppliedTwitterUrl) {
        lastAppliedTwitterUrl = location.href
    }
    let twits = document.querySelectorAll('[data-testid="tweetText"]')
    if (twits) {
        for (let el of twits) {
            if (!el.classList.contains('has-assigned-label')) {

                if (counter % 2 == 0) {
                    el.classList.add('assigned-label-negative')
                } else {
                    el.classList.add('assigned-label-positive')
                }
                counter++
                el.classList.add('has-assigned-label')
            }
        }
    }
}