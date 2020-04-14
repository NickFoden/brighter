/**
 * Create a client
 */

interface ParamsObject {
  apiKey: string;
  apiUrl: string;
}

interface eventObject {
  time: number;
}

export const createClient = (params: ParamsObject) => {
  if (!params || !params.apiKey || !params.apiUrl) {
    throw new Error("apiKey && apiUrl required in createClient");
  }

  const isDev = process.env.NODE_ENV === "development";

  let key = "start";
  const API_KEY = params.apiKey;

  const brighter = (event: eventObject) => {
    if (!event.time) {
      event.time = Date.now();
    }
    let windowObj = {};
    if (typeof window !== "undefined") {
      windowObj["href"] = window.location.href;
      windowObj["pathname"] = window.location.pathname;
      windowObj["navigatorUserAgent"] = window.navigator.userAgent;
    }
    const THE_URL = `${params.apiUrl}/${key}/${API_KEY}`;
    return new Promise(function (resolve, reject) {
      fetch(THE_URL, {
        method: "POST",
        body: JSON.stringify({ event, windowObj }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((data) => data.json())
        .then((result) => {
          const { status } = result;
          switch (status) {
            case "created":
              key = result.key;
              break;
            case "saved":
              if (isDev) {
                console.log("added new event");
                console.dir(result);
              }
              break;
            case "error":
              if (isDev) {
                console.log("error");
                console.dir(result);
              }
              break;
            default:
              if (isDev) {
                console.dir(result);
              }
              break;
          }
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };

  return brighter;
};
