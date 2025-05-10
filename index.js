import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware, requireAuth, getAuth, clerkClient } from "@clerk/express";
import redisClient from "./redisclient.js";
dotenv.config();

const app = express();
const handleUnauthorized = (req, res) => {
  return res.status(401).json({ message: "Unauthorized - No valid token" });
};

const corsOptions = {
  origin: "*", // Or specify your IP address if necessary
  credentials: true, // Allow credentials (like tokens, if needed)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());


const singers={
  "singers": [
    {
      "name": "The Weeknd",
      "famous_song": "Blinding Lights"
    },
    {
      "name": "Travis Scott",
      "famous_song": "SICKO MODE"
    },
    {
      "name": "Lana Del Rey",
      "famous_song": "Summertime Sadness"
    },
    {
      "name": "Ariana Grande",
      "famous_song": "7 rings"
    },
    {
      "name": "Olivia Rodrigo",
      "famous_song": "drivers license"
    },
    {
      "name": "Billie Eilish",
      "famous_song": "bad guy"
    }
  ]
}

redisClient.set("singers", JSON.stringify(singers));


// ✅ Protected test route
app.get("/",requireAuth({ unauthorized: handleUnauthorized }),  (req, res) => {
  redisClient.set("test", "test");
  res.json({ message: "Hello World" });
});

// ✅ Protected route with user info
app.get("/protected", requireAuth({ unauthorized: handleUnauthorized }), async (req, res) => {
  const { userId } = getAuth(req);
  const user = await clerkClient.users.getUser(userId);
  await redisClient.set("user", JSON.stringify(user));
  console.log(user);
  
  res.json({ user });
});

app.get("/user", async (req, res) => {
  const text = await redisClient.get("text");
  res.json({ text });
});

app.get("/redis", async (req, res) => {
  const text = await redisClient.set("redisset", "i have set bt changed");
  res.json({ "message": "Hello World" });
});

app.get("/redisget", async (req, res) => {
  const text = await redisClient.get("redisset");
  res.json({ text});
});


app.get("/singers", async (req, res) => {
  const text = await redisClient.get("singers");
  res.json({ text});
});



app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
