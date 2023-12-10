console.log("Extension Started!")

init()

function init() {
    new MutationObserver(() => { }).observe(document.body, { childList: true, subtree: true })
    setInterval(updateTwitterClasses, 800)
}

var lastAppliedTwitterUrl = null
var counter = 0

async function updateTwitterClasses() {
    if (location.href != lastAppliedTwitterUrl) {
        lastAppliedTwitterUrl = location.href
    }
    let tweets = document.querySelectorAll('[data-testid="tweetText"]')
    if (tweets) {
        for (let el of tweets) {
            if (!el.classList.contains('has-assigned-label')) {
                let tweetText
                let sentiment
                let span = el.querySelector('span')
                if (span) {
                    tweetText = span.innerText
                }
                try {
                    let response = await fetch('http://localhost:8000/calc', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            text: tweetText,
                        }),
                    })

                    if (response.ok) {
                        let data = await response.json()
                        sentiment = data.sentiment
                    } else {
                        console.error('API request failed:', response.statusText)
                    }
                } catch (error) {
                    console.error('Error making API request:', error.message)
                }

                switch (sentiment) {
                    case "Positive":
                        el.classList.add('assigned-label-positive')
                        break
                    case "Negative":
                        el.classList.add('assigned-label-negative')
                        break
                    case "Neutral":
                        el.classList.add('assigned-label-neutral')
                        break
                    case "Irrelevant":
                        el.classList.add('assigned-label-irrelevant')
                        break
                    default:
                        break
                }

                el.classList.add('has-assigned-label')
            }
        }
    }
}
