import axios from "axios";
import FormData from "form-data";
import https from "https";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

export const uploadToStreamtape = async (buffer, filename) => {
  try {
    const { data: initRes } = await axios.get(
      "https://api.streamtape.com/file/ul",
      {
        params: {
          login: process.env.STREAMTAPE_LOGIN,
          key: process.env.STREAMTAPE_KEY,
          folder: process.env.STREAMTAPE_FOLDER,
        },
      }
    );

    if (initRes.status !== 200 || !initRes.result?.url) {
      throw new Error("Failed to get upload URL from Streamtape.");
    }

    const uploadUrl = initRes.result.url;

    const form = new FormData();
    form.append("file1", buffer, filename);

    const agent = new https.Agent({
      keepAlive: true,
      family: 4, // Force IPv4
    });

    const { data: uploadRes } = await axios.post(uploadUrl, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      httpsAgent: agent,
    });

    if (uploadRes.status !== 200 || !uploadRes.result?.id) {
      throw new Error("Upload failed or no file ID returned.");
    }

    const result = uploadRes.result;

    return {
      fileId: result.id,
      fileName: result.name,
      streamUrl: `https://streamtape.com/e/${result.id}`,
      downloadUrl: result.url,
      size: result.size,
      contentType: result.content_type,
      sha256: result.sha256,
    };
  } catch (error) {
    console.error("Upload error:", error.message);
    throw error;
  }
};
