import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@/lib/embeddings-supabase";
import * as cheerio from "cheerio";


// embedding doc sizes
const docSize: number = 1000;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_PROXY = process.env.OPENAI_PROXY;
const PDF2TEXT_PROXY = process.env.PDF2TEXT_PROXY;


export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method === "POST") {
    const { urls } = body;
    const documents = await getDocuments(urls);

    for (const { url, body } of documents) {
      const input = body.replace(/\n/g, " ");

      console.log("\nDocument length: \n", body.length);
      console.log("\nURL: \n", url);

      const apiKey = OPENAI_API_KEY;
      const apiURL = OPENAI_PROXY;

      const embeddingResponse = await fetch(
        apiURL + "/v1/embeddings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input,
            model: "text-embedding-ada-002"
          })
        }
      );
      // console.log("\nembeddingResponse: \n", embeddingResponse);
      const embeddingData = await embeddingResponse.json();

      const [{ embedding }] = embeddingData.data;
      // console.log("embedding:" + embedding);

      // In production we should handle possible errors
      try {
        let res = await supabaseClient.from("documents").insert({
          content: input,
          embedding,
          url
        });
      }
      catch (error) {
        console.error("error in supabase insert: " + error);
      }

    }
    return res.status(200).json({ success: true });
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}

async function getDocuments(urls: string[]) {
  const documents = [];
  for (const url of urls) {
    let fetchURL = url;
    let articleText = "";
    if (process.env.SPLASH_URL != "") {
      fetchURL = `${process.env.SPLASH_URL}/render.html?url=${encodeURIComponent(url)}&timeout=10&wait=0.5`
    }
    console.log("fetching url: " + fetchURL);

    if (fetchURL.endsWith('.pdf')){
      await fetch(PDF2TEXT_PROXY + '/pdf2text', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fetchURL })
      }).then(function (response) {
          console.log("We are getting response ... Fetching url is ending with .pdf: " + fetchURL);
          const respJson = response.json();
          return respJson;
        })
        .then(function (data) {
          articleText = JSON.stringify(data);
        });
    } else {
      const response = await fetch(fetchURL);
      const html = await response.text();
      const $ = cheerio.load(html);
      // tag based e.g. <main>
      articleText = $("body").text();
    }

    let start = 0;
    while (start < articleText.length) {
      const end = start + docSize;
      const chunk = articleText.slice(start, end);
      documents.push({ url, body: chunk });
      start = end;
    }
  }
  return documents;
}
