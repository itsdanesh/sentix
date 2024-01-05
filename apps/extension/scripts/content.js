// Constructing simple API client for creating reports and calculating sentiment
const createSentixClient = () => {
  const BACKEND_URL = "http://127.0.0.1:8000";

  const SENTIMENT_URL = `${BACKEND_URL}/calc`;
  const REPORT_URL = `${BACKEND_URL}/report`;

  return {
    calculateSentiment: async (text) => {
      try {
        const response = await fetch(SENTIMENT_URL, {
          method: "POST",
          body: JSON.stringify({ text }),
          headers: {
            "Content-Type": "application/json",
            "cache-control": "no-store",
          },
        });

        const responseJson = await response.json();
        return { ok: true, sentiment: responseJson.sentiment };
      } catch (err) {
        return { ok: false, err };
      }
    },
    reportSentiment: async (text, sentiment) => {
      try {
        const response = await fetch(REPORT_URL, {
          method: "POST",
          body: JSON.stringify({ sentiment, text }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        return true;
      } catch (err) {
        return false;
      }
    },
  };
};

// Factory for report buttons based on the textual content of the tweet
const createReportButton = async (tweetText, sentiment) => {
  const button = document.createElement("button");

  const buttonText = {
    initial: "Flag as incorrect",
    flagged: "Tweet flagged",
  };

  button.textContent = buttonText.initial;
  button.classList.add("report-btn");

  button.addEventListener("click", async () => {
    if (button.textContent === buttonText.initial) {
      try {
        button.disabled = true;
        button.textContent = "Reporting...";
        await client.reportSentiment(tweetText, sentiment);
        button.textContent = buttonText.flagged;
      } catch (err) {
        button.textContent = buttonText.initial;
        console.error(`Unable to report tweet ${tweetText}`);
      } finally {
        button.disabled = false;
      }

      return;
    }

    button.textContent = buttonText.initial;
  });

  return button;
};

const client = createSentixClient();

let lastAppliedTwitterUrl = null;
let counter = 0;

const init = () => {
  new MutationObserver(() => {}).observe(document.body, {
    childList: true,
    subtree: true,
  });
  setInterval(updateTwitterClasses, 5000);
};

async function updateTwitterClasses() {
  if (location.href != lastAppliedTwitterUrl) {
    lastAppliedTwitterUrl = location.href;
  }
  const tweetDomNodes = [
    ...document.querySelectorAll('[data-testid="tweetText"]'),
  ];

  const ASSIGNED_CLASS = "has-assigned-label";

  for (const node of tweetDomNodes) {
    if (!node.classList.contains(ASSIGNED_CLASS)) {
      node.classList.add(ASSIGNED_CLASS);

      const tweetText = node.querySelector("span")?.innerText;

      const response = await client.calculateSentiment(tweetText);
      const sentiment = response.ok
        ? response.sentiment
        : console.error(`Unable to calculate sentiment for "${tweetText}".`);

      const containerNode =
        node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode.parentNode;

      const reportButton = await createReportButton(tweetText, sentiment);
      node.appendChild(reportButton);

      const overlay = document.createElement("div");
      overlay.classList.add("container", sentiment && `container-${sentiment}`);
      containerNode.appendChild(overlay);
    }
  }
}

init();
