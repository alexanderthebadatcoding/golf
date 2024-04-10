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
    nir: "🇬🇧",
    aus: "🇦🇺",
    nor: "🇳🇴",
    pol: "🇵🇱",
    col: "🇨🇴",
    can: "🇨🇦",
    fij: "🇫🇯",
    mex: "🇲🇽",
    // Add more country code mappings as needed
  };

  // Return the emoji flag corresponding to the country code, or return an empty string if not found
  return flagEmojiMap[countryCode.toLowerCase()] || "⛳️";
}

async function fetchESPNData(i: number) {
  try {
    const response = await fetch(
      "https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard/players?region=us&lang=en&event=401580344"
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

    // Extract relevant information
    let score = "";
    if (player.stats && player.stats.length > 3) {
      score = player.stats[3].value;
      //         money = player.stats[18].displayValue;
      // @TODO add hole info
    }

    return {
      length,
      name,
      player,
      flagEmoji,
      playerName,
      playerRank,
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
          background: "white",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <img
          alt="Home Team"
          height={400}
          src="https://bracket.game/favicons/apple-touch-icon.png"
          style={{ margin: "0 2px" }}
          width={400}
        />
        <div
          style={{
            color: "#2F5FF6",
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
          Bracket.Game
        </div>
      </div>
    ),
    intents: [<Button value="next">View Games</Button>],
  });
});

app.frame("/top5", async (c) => {
  // const { buttonValue } = c;
  const firstPlayer = await fetchESPNData(0);
  const secondPlayer = await fetchESPNData(1);
  const thirdPlayer = await fetchESPNData(2);
  const fourthPlayer = await fetchESPNData(3);
  const fifthPlayer = await fetchESPNData(4);

  // console.log(firstPlayer);
  // Define the action for the "back" button
  // let backAction = i > 0 ? `/${i - 1}` : `/`;
  // Define the action for the "next" button
  // let nextAction = i < espnData?.length - 1 ? `/${i + 1}` : null;
  // let homeSlug = espnData?.homeSlug;
  // let awaySlug = espnData?.awaySlug;
  // const leftArrow = "\u2190"; // Left arrow ←
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
          backgroundImage: `linear-gradient(to bottom, #076652, #000)`,
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
          }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            {firstPlayer?.playerRank} {firstPlayer?.flagEmoji}{" "}
            {firstPlayer?.playerName} {firstPlayer?.score}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {secondPlayer?.playerRank} {secondPlayer?.flagEmoji}{" "}
            {secondPlayer?.playerName} {secondPlayer?.score}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {thirdPlayer?.playerRank} {thirdPlayer?.flagEmoji}{" "}
            {thirdPlayer?.playerName} {thirdPlayer?.score}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fourthPlayer?.playerRank} {fourthPlayer?.flagEmoji}{" "}
            {fourthPlayer?.playerName} {fourthPlayer?.score}
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {fifthPlayer?.playerRank} {fifthPlayer?.flagEmoji}{" "}
            {fifthPlayer?.playerName} {fifthPlayer?.score}
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

      <Button value="next" action="/next5">
        {rightArrow}
      </Button>,
      <Button.Reset>Back</Button.Reset>,
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
