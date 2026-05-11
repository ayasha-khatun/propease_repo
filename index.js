// index.js (CommonJS)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// ✅ FIX 1: CORS — Vercel + Firebase + localhost সব allow
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://propease-baa74.web.app",
        "https://propease-baa74.firebaseapp.com",
        "https://propease-client-side.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
      ];
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow exact matches
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow all Vercel preview deployments
      if (/^https:\/\/propease-client-side.*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Decode Base64 Firebase Service Key
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hdyrpo2.mongodb.net/realEstateDB?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedData) => {
    if (err) {
      return res.status(401).send({ message: "Invalid Token" });
    }
    req.decoded = decodedData;
    next();
  });
};

// MongoDB collections
let usersCollection;
let propertiesCollection;
let wishlistCollection;
let offersCollection;
let reviewsCollection;
let contactCollection;

// Agent middleware
const verifyAgent = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const user = await usersCollection.findOne({ email });
    if (!user || user.role !== "agent") {
      return res.status(403).send({ message: "🚫 forbidden access: agents only" });
    }
    if (user.isFraud) {
      return res.status(403).send({ message: "🚫 Access denied: fraud agents cannot add properties" });
    }
    next();
  } catch (error) {
    console.error("verifyAgent error:", error);
    res.status(500).send({ error: "Server error in verifyAgent" });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const user = await usersCollection.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "🚫 forbidden access: admins only" });
    }
    next();
  } catch (error) {
    console.error("verifyAdmin error:", error);
    res.status(500).send({ error: "Server error in verifyAdmin" });
  }
};

async function run() {
  try {
    // await client.connect();
    const db = client.db("test");
    usersCollection = db.collection("users");
    propertiesCollection = db.collection("properties");
    wishlistCollection = db.collection("wishlist");
    offersCollection = db.collection("offers");
    reviewsCollection = db.collection("reviews");
    contactCollection = db.collection("contacts");

    // ==================== JWT ====================
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      if (!user?.email) {
        return res.status(400).send({ message: "Email missing" });
      }
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    });

    // ==================== USERS ====================

    // ✅ FIX 2: Specific routes BEFORE parameterized /:email routes
    // GET user role — must be before /users/:email
    app.get("/users/role/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "Forbidden access" });
      }
      const user = await usersCollection.findOne({ email });
      res.send({ role: user?.role || "user" });
    });

    // GET all users (admin)
    app.get("/users/admin", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await usersCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch users" });
      }
    });

    // GET all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // ✅ FIX 3: PUT /users/:email — upsert করে, Google login এও কাজ করবে
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      // role preserve করো — নতুন user হলে 'user' set করো, existing হলে পরিবর্তন করো না
      const existingUser = await usersCollection.findOne({ email });
      const updateData = {
        name: user.name,
        email: user.email,
        photo: user.photo,
        // existing role থাকলে রাখো, না থাকলে 'user' দাও
        role: existingUser?.role || user.role || "user",
      };
      const result = await usersCollection.updateOne(
        { email },
        { $set: updateData },
        { upsert: true }
      );
      res.send(result);
    });

    // POST create user
    app.post("/users", async (req, res) => {
      const user = req.body;
      user.role = "user";
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Make Admin
    app.patch("/users/make-admin/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role: "admin" } }
        );
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (err) {
        res.status(500).send({ message: "Failed to make admin" });
      }
    });

    // Make Agent
    app.patch("/users/make-agent/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role: "agent" } }
        );
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (err) {
        res.status(500).send({ message: "Failed to make agent" });
      }
    });

    // Mark as Fraud
    app.patch("/users/mark-fraud/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const user = await usersCollection.findOne(filter);
        if (!user || user.role !== "agent") {
          return res.status(400).send({ success: false, message: "Only agents can be marked as fraud" });
        }
        await usersCollection.updateOne(filter, { $set: { role: "fraud" } });
        await propertiesCollection.deleteMany({ agentEmail: user.email });
        res.send({ success: true, message: "Agent marked as fraud and properties removed" });
      } catch (err) {
        res.status(500).send({ message: "Failed to mark fraud" });
      }
    });

    // Delete user (DB + Firebase)
    app.delete("/users/:email", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const email = req.params.email;
        await usersCollection.deleteOne({ email });
        try {
          const userRecord = await admin.auth().getUserByEmail(email);
          await admin.auth().deleteUser(userRecord.uid);
        } catch (firebaseErr) {
          console.warn("Firebase delete skipped:", firebaseErr.message);
        }
        res.send({ success: true, message: "User deleted" });
      } catch (err) {
        res.status(500).send({ message: "Failed to delete user", error: err.message });
      }
    });

    // ==================== PROPERTIES ====================

    app.get("/properties/agent/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        const properties = await propertiesCollection.find({ agentEmail: email }).toArray();
        res.send(properties);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch properties" });
      }
    });

    app.post("/properties", verifyToken, verifyAgent, async (req, res) => {
      try {
        const property = req.body;
        const agent = await usersCollection.findOne({ email: property.agentEmail });
        if (!agent) {
          return res.status(404).send({ error: "Agent not found" });
        }
        property.verificationStatus = "pending";
        property.createdAt = new Date();
        property.agentImage = agent.photo || "";
        const result = await propertiesCollection.insertOne(property);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to add property" });
      }
    });

    app.get("/properties/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const property = await propertiesCollection.findOne({ _id: new ObjectId(id) });
        if (!property) {
          return res.status(404).send({ message: "Property not found" });
        }
        if (property.agentEmail) {
          const agent = await usersCollection.findOne(
            { email: property.agentEmail },
            { projection: { name: 1, email: 1, photo: 1 } }
          );
          property.agentName = agent?.name || property.agentName || "Unknown Agent";
          property.agentEmail = agent?.email || property.agentEmail || "";
          property.agentPhoto = agent?.photo || property.agentPhoto || null;
        }
        property.location = property.location || "Not Provided";
        property.verificationStatus = property.verificationStatus || "pending";
        property.priceRange = property.priceRange || "N/A";
        res.send(property);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch property" });
      }
    });

    app.patch("/properties/:id", verifyToken, verifyAgent, async (req, res) => {
      try {
        const id = req.params.id;
        const update = req.body;
        const result = await propertiesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: update }
        );
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to update property" });
      }
    });

    app.delete("/properties/:id", verifyToken, verifyAgent, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await propertiesCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to delete property" });
      }
    });

    app.get("/admin/properties", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const properties = await propertiesCollection.find().toArray();
        res.send(properties);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch properties" });
      }
    });

    app.get("/verified-properties", async (req, res) => {
      try {
        const properties = await propertiesCollection
          .find({ verificationStatus: "verified" })
          .toArray();
        const enrichedProperties = await Promise.all(
          properties.map(async (property) => {
            try {
              const agent = await usersCollection.findOne({ email: property.agentEmail });
              return {
                ...property,
                agentName: agent?.name || property.agentName || "Agent",
                agentImage: agent?.photo || property.agentImage || "",
                agentEmail: agent?.email || property.agentEmail || "",
              };
            } catch {
              return property;
            }
          })
        );
        res.send(enrichedProperties);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch verified properties" });
      }
    });

    app.patch("/admin/properties/:id/verify", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ success: false, message: "Invalid property ID" });
        }
        const result = await propertiesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { verificationStatus: "verified" } }
        );
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (err) {
        res.status(500).send({ success: false, message: "Failed to verify property" });
      }
    });

    app.patch("/admin/properties/:id/reject", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;
        const result = await propertiesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { verificationStatus: "rejected" } }
        );
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (err) {
        res.status(500).send({ message: "Failed to reject property" });
      }
    });

    app.get("/admin/verified-properties", verifyToken, async (req, res) => {
      try {
        const result = await propertiesCollection
          .find({ verificationStatus: "verified" })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch verified properties" });
      }
    });

    app.patch("/admin/properties/:id/advertise", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await propertiesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { isAdvertised: true } }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to advertise property" });
      }
    });

    app.get("/advertised-properties", async (req, res) => {
      try {
        const result = await propertiesCollection.find({ isAdvertised: true }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch advertised properties" });
      }
    });

    // ==================== WISHLIST ====================

    app.get("/wishlist", verifyToken, async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send({ error: "Email query required" });
        }
        const result = await wishlistCollection
          .find({ userEmail: email })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch wishlist" });
      }
    });

    app.post("/wishlist", verifyToken, async (req, res) => {
      try {
        const item = req.body;
        const exists = await wishlistCollection.findOne({
          userEmail: item.userEmail,
          propertyId: item.propertyId,
        });
        if (exists) {
          return res.status(409).send({ message: "Already in wishlist" });
        }
        item.createdAt = new Date();
        const result = await wishlistCollection.insertOne(item);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to add to wishlist" });
      }
    });

    app.delete("/wishlist/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await wishlistCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Wishlist item not found" });
        }
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to delete wishlist item" });
      }
    });

    // ==================== OFFERS ====================
    // ✅ FIX 4: Specific routes BEFORE /:id to avoid route conflicts

    // GET sold offers for agent
    app.get("/offers/sold/:agentEmail", verifyToken, async (req, res) => {
      try {
        const { agentEmail } = req.params;
        const soldOffers = await offersCollection
          .find({ agentEmail, status: "bought" })
          .toArray();
        res.send(soldOffers);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch sold properties" });
      }
    });

    // GET offers for agent
    app.get("/offers/agent/:email", async (req, res) => {
      const agentEmail = req.params.email;
      try {
        const result = await offersCollection.find({ agentEmail }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch agent offers" });
      }
    });

    // PATCH accept offer
    app.patch("/offers/accept/:id", verifyToken, async (req, res) => {
      try {
        const offerId = req.params.id;
        const { propertyId } = req.body;
        const acceptResult = await offersCollection.updateOne(
          { _id: new ObjectId(offerId) },
          { $set: { status: "accepted" } }
        );
        const rejectOthers = await offersCollection.updateMany(
          { propertyId: propertyId, _id: { $ne: new ObjectId(offerId) } },
          { $set: { status: "rejected" } }
        );
        res.send({
          modifiedCount: acceptResult.modifiedCount + rejectOthers.modifiedCount,
          acceptResult,
          rejectOthers,
        });
      } catch (error) {
        res.status(500).send({ error: "Failed to accept offer" });
      }
    });

    // PATCH reject offer
    app.patch("/offers/reject/:id", verifyToken, async (req, res) => {
      try {
        const offerId = req.params.id;
        const result = await offersCollection.updateOne(
          { _id: new ObjectId(offerId) },
          { $set: { status: "rejected" } }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to reject offer" });
      }
    });

    // PATCH pay for offer
    app.patch("/offers/buy/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const { transactionId } = req.body;
      const offer = await offersCollection.findOne({ _id: new ObjectId(id) });
      if (!offer) return res.status(404).send({ message: "Offer not found" });
      if (req.decoded.email !== offer.buyerEmail) {
        return res.status(403).send({ message: "Forbidden: Not your offer" });
      }
      if (offer.status !== "accepted") {
        return res.status(400).send({ message: "Offer not accepted yet" });
      }
      const result = await offersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "bought", transactionId } }
      );
      res.send({ success: true, modifiedCount: result.modifiedCount, transactionId });
    });

    // POST make an offer
    app.post("/offers", verifyToken, async (req, res) => {
      const offer = req.body;
      const { propertyId, buyerEmail, offerAmount } = offer;
      try {
        const existing = await offersCollection.findOne({ propertyId, buyerEmail });
        if (existing) {
          return res.send({ alreadyOffered: true });
        }
        const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });
        if (!property) {
          return res.status(404).send({ error: "Property not found" });
        }
        const user = await usersCollection.findOne({ email: buyerEmail });
        if (!user || user.role !== "user") {
          return res.status(403).send({ error: "Only users can buy property" });
        }
        if (offerAmount < property.minPrice || offerAmount > property.maxPrice) {
          return res.status(400).send({ error: "Offer outside allowed range" });
        }
        const result = await offersCollection.insertOne(offer);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to create offer" });
      }
    });

    // GET offers by buyer email
    app.get("/offers", async (req, res) => {
      const email = req.query.email;
      const query = email ? { buyerEmail: email } : {};
      try {
        const result = await offersCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch offers" });
      }
    });

    // GET single offer — MUST be after all /offers/specific routes
    app.get("/offers/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const offer = await offersCollection.findOne({ _id: new ObjectId(id) });
      if (!offer) return res.status(404).send({ message: "Offer not found" });
      res.send(offer);
    });

    // DELETE offer
    app.delete("/offers/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await offersCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to delete offer" });
      }
    });

    // ==================== CONTACT ====================

    app.post("/contact", async (req, res) => {
      try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
          return res.status(400).send({ success: false, message: "All fields are required" });
        }
        const result = await contactCollection.insertOne({
          name,
          email,
          message,
          createdAt: new Date(),
        });
        res.send({ success: true, message: "Message sent successfully", data: result });
      } catch (error) {
        res.status(500).send({ success: false, message: "Failed to send message" });
      }
    });

    // ==================== REVIEWS ====================

    app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;
        if (!review.reviewerEmail || !review.propertyId || !review.review) {
          return res.status(400).send({ message: "Missing required fields" });
        }
        const newReview = {
          propertyId: review.propertyId,
          propertyTitle: review.propertyTitle || "",
          review: review.review,
          reviewerEmail: review.reviewerEmail,
          reviewerName: review.reviewerName || "Anonymous",
          reviewerImage: review.reviewerImage || "/default-user.png",
          reviewTime: review.reviewTime || new Date().toISOString(),
          createdAt: new Date(),
        };
        const result = await reviewsCollection.insertOne(newReview);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add review" });
      }
    });

    // Specific routes before /:id
    app.get("/reviews/latest", async (req, res) => {
      try {
        const reviews = await reviewsCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch latest reviews" });
      }
    });

    app.get("/reviews/user/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const reviews = await reviewsCollection
          .find({ reviewerEmail: email })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch reviews" });
      }
    });

    app.get("/reviews/property/:id", async (req, res) => {
      try {
        const propertyId = req.params.id;
        const reviews = await reviewsCollection
          .find({ propertyId })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch property reviews" });
      }
    });

    app.get("/admin/reviews", async (req, res) => {
      try {
        const reviews = await reviewsCollection.find().sort({ createdAt: -1 }).toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch reviews" });
      }
    });

    app.delete("/reviews/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete review" });
      }
    });

    app.delete("/admin/reviews/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete review" });
      }
    });

    // Root route
    app.get("/", (req, res) => {
      res.send("✅ Real Estate Platform Backend Running");
    });

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ Error connecting to DB:", error);
  }
}

run().catch(console.dir);
