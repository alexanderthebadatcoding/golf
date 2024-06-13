import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

function getCountryFlagEmoji(countryFlagUrl) {
  // Extract the country code from the URL
  let countryCode = countryFlagUrl.split("/")[7].split(".")[0]; // Extracts "esp" from the given URL

  // Map country codes to emoji flags
  let flagEmojiMap = {
    usa: "🇺🇸",
    esp: "🇪🇸",
    rsa: "🇿🇦",
    ger: "🇩🇪",
    den: "🇩🇰",
    kor: "🇰🇷",
    jpn: "🇯🇵",
    eng: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    nir: "🇮🇪",
    aus: "🇦🇺",
    nor: "🇳🇴",
    pol: "🇵🇱",
    col: "🇨🇴",
    can: "🇨🇦",
    fij: "🇫🇯",
    mex: "🇲🇽",
    nzl: "🇳🇿",
    fra: "🇫🇷",
    chi: "🇨🇱",
    swe: "🇸🇪",
    sct: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    ita: "🇮🇹",
    phi: "🇵🇭"
    // Add more country code mappings as needed
  };

  // Return the emoji flag corresponding to the country code, or return an empty string if not found
  return flagEmojiMap[countryCode.toLowerCase()] || "⛳️";
}

async function fetchESPNData(i: number) {
  try {
    const response = await fetch(
      "https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard/players?region=us&lang=en&event=401580355"
    );
    const data = await response.json();
    // Use ESPN data to populate the frame
    // Extract information about the next game
    // Extract information about the next game
    const leaderboard = data.leaderboard;
    const length = leaderboard.length;
    const name = data.name;
    const player = leaderboard[i];
    let flagEmoji = getCountryFlagEmoji(player.countryFlag);
    const playerName = player.fullName;
    const playerRank = player.rank;
    const id = player.id;

    // Extract relevant information
    let score = "";
    let prize = "";
    const playerScore = await getScore(id);
    if (playerScore !== null) {
      score = playerScore.score;
      // console.log(score);
    } else if (player.stats && player.stats.length > 3) {
      score = player.stats[3].displayValue;
    }
    // if (player.stats && player.stats.length > 18) {
      // prize = player.stats[18].displayValue;
    // }

    return {
      length,
      name,
      player,
      flagEmoji,
      playerName,
      playerRank,
      score,
      id,
      prize,
    };
  } catch (error) {
    console.error("Error fetching ESPN data:", error);
    return null;
  }
}

async function getScore(i: number) {
  try {
    const response = await fetch(
      `http://sports.core.api.espn.com/v2/sports/golf/leagues/pga/events/401580355/competitions/401580355/competitors/${i}/score?lang=en&region=us`
    );
    const data = await response.json();
    // Use ESPN data to populate the frame
    // Extract information about the next game
    // Extract information about the next game
    const score = data.displayValue;
    // console.log(score);
    return {
      score,
    };
  } catch (error) {
    console.error("Error fetching ESPN data:", error);
    return null;
  }
}

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

app.frame("/", (c) => {
  // const { buttonValue, status } = c;
  return c.res({
    action: "/top5",
    image: (
      <div
        style={{
          alignItems: "center",
          // backgroundImage: `linear-gradient(to bottom, #076652, #F9F304)`,
          background: "#1C4932",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          fontSize: 80,
        }}
      >
        <div
          style={{
            color: "#FCE300",
            fontSize: 100,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 0,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
            fontWeight: "bold",
            fontFamily: "Inter",
          }}
        >
          ⛳ Golf Score Card
        </div>
      </div>
    ),
    intents: [<Button value="next">View Leaderboard</Button>],
  });
});

app.frame("/top5", async (c) => {
  // const { buttonValue } = c;
  const firstPlayer = await fetchESPNData(0);
  const secondPlayer = await fetchESPNData(1);
  const thirdPlayer = await fetchESPNData(2);
  const fourthPlayer = await fetchESPNData(3);
  const fifthPlayer = await fetchESPNData(4);
  const rightArrow = "\u2192";
  // Example usage:
  return c.res({
    // action: action,
    image: (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(to bottom, #1C4932, #000)`,
          fontSize: 66,
          fontWeight: 900,
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div style={{ marginBottom: 15 }}>{firstPlayer?.name}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 25,
            width: "100%",
            padding: 20,
            fontSize: 56,
            fontWeight: 700,
            fontFamily: "Inter",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            {firstPlayer?.playerRank} {firstPlayer?.flagEmoji}{" "}
            {firstPlayer?.playerName} {firstPlayer?.score} {firstPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {secondPlayer?.playerRank} {secondPlayer?.flagEmoji}{" "}
            {secondPlayer?.playerName} {secondPlayer?.score}{" "}
            {secondPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {thirdPlayer?.playerRank} {thirdPlayer?.flagEmoji}{" "}
            {thirdPlayer?.playerName} {thirdPlayer?.score} {thirdPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fourthPlayer?.playerRank} {fourthPlayer?.flagEmoji}{" "}
            {fourthPlayer?.playerName} {fourthPlayer?.score}{" "}
            {fourthPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fifthPlayer?.playerRank} {fifthPlayer?.flagEmoji}{" "}
            {fifthPlayer?.playerName} {fifthPlayer?.score} {fifthPlayer?.prize}
          </div>
        </div>
      </div>
    ),
    intents: [
      // <Button.Link href={`https://bracket.game/${homeSlug}`}>
      //   {" "}
      //   {espnData?.homeTeamShort}
      // </Button.Link>,
      // <Button.Link href={`https://bracket.game/${awaySlug}`}>
      //   {" "}
      //   {espnData?.awayTeamShort}
      // </Button.Link>,
      // <Button value="back" action={backAction}>
      //   {leftArrow}
      // </Button>,

      <Button value="next" action="/top10">
        {rightArrow}
      </Button>,
      ,
    ],
  });
});
app.frame("/top10", async (c) => {
  // const { buttonValue } = c;
  const firstPlayer = await fetchESPNData(5);
  const secondPlayer = await fetchESPNData(6);
  const thirdPlayer = await fetchESPNData(7);
  const fourthPlayer = await fetchESPNData(8);
  const fifthPlayer = await fetchESPNData(9);
  const rightArrow = "\u2192";
  const leftArrow = "\u2190";
  // Example usage:
  return c.res({
    // action: action,
    image: (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(to bottom, #1C4932, #000)`,
          fontSize: 66,
          fontWeight: 900,
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div style={{ marginBottom: 15 }}>{firstPlayer?.name}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 25,
            width: "100%",
            padding: 20,
            fontSize: 56,
            fontWeight: 700,
            fontFamily: "Inter",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            {firstPlayer?.playerRank} {firstPlayer?.flagEmoji}{" "}
            {firstPlayer?.playerName} {firstPlayer?.score} {firstPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {secondPlayer?.playerRank} {secondPlayer?.flagEmoji}{" "}
            {secondPlayer?.playerName} {secondPlayer?.score}{" "}
            {secondPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {thirdPlayer?.playerRank} {thirdPlayer?.flagEmoji}{" "}
            {thirdPlayer?.playerName} {thirdPlayer?.score} {thirdPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fourthPlayer?.playerRank} {fourthPlayer?.flagEmoji}{" "}
            {fourthPlayer?.playerName} {fourthPlayer?.score}{" "}
            {fourthPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fifthPlayer?.playerRank} {fifthPlayer?.flagEmoji}{" "}
            {fifthPlayer?.playerName} {fifthPlayer?.score} {fifthPlayer?.prize}
          </div>
        </div>
      </div>
    ),
    intents: [
      // <Button.Link href={`https://bracket.game/${homeSlug}`}>
      //   {" "}
      //   {espnData?.homeTeamShort}
      // </Button.Link>,
      // <Button.Link href={`https://bracket.game/${awaySlug}`}>
      //   {" "}
      //   {espnData?.awayTeamShort}
      // </Button.Link>,
      <Button value="back" action="/top5">
        {leftArrow}
      </Button>,

      <Button value="next" action="/top15">
        {rightArrow}
      </Button>,
    ],
  });
});
app.frame("/top15", async (c) => {
  // const { buttonValue } = c;
  const firstPlayer = await fetchESPNData(10);
  const secondPlayer = await fetchESPNData(11);
  const thirdPlayer = await fetchESPNData(12);
  const fourthPlayer = await fetchESPNData(13);
  const fifthPlayer = await fetchESPNData(14);
  // Example usage:
  return c.res({
    // action: action,
    image: (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(to bottom, #1C4932, #000)`,
          fontSize: 66,
          fontWeight: 900,
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div style={{ marginBottom: 15 }}>{firstPlayer?.name}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 25,
            width: "100%",
            padding: 20,
            fontSize: 56,
            fontWeight: 700,
            fontFamily: "Inter",
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            {firstPlayer?.playerRank} {firstPlayer?.flagEmoji}{" "}
            {firstPlayer?.playerName} {firstPlayer?.score} {firstPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {secondPlayer?.playerRank} {secondPlayer?.flagEmoji}{" "}
            {secondPlayer?.playerName} {secondPlayer?.score}{" "}
            {secondPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {thirdPlayer?.playerRank} {thirdPlayer?.flagEmoji}{" "}
            {thirdPlayer?.playerName} {thirdPlayer?.score} {thirdPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fourthPlayer?.playerRank} {fourthPlayer?.flagEmoji}{" "}
            {fourthPlayer?.playerName} {fourthPlayer?.score}{" "}
            {fourthPlayer?.prize}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fifthPlayer?.playerRank} {fifthPlayer?.flagEmoji}{" "}
            {fifthPlayer?.playerName} {fifthPlayer?.score} {fifthPlayer?.prize}
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button.Link href="https://bracket.game/">Bracket.Game </Button.Link>,
      <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
