const uber = {
  id: "uber",
  label: "Uber",
  steps: [
    {
      title: "Requirements",
      content: [
        "Rider requests a ride",
        "Driver accepts/rejects",
        "Real-time tracking",
        "Fare calculation",
      ],
    },
    {
      title: "Core Entities",
      content: [
        "Rider: id, name, location",
        "Driver: id, name, location, status",
        "Ride: id, status, riderId, driverId, pickup, dropoff",
      ],
    },
    {
      title: "API / Interface",
      content: [
        "POST /v1/rides — request a new ride",
        "PATCH /v1/rides/:id — accept/reject ride",
        "GET /v1/rides/:id — get ride status",
        "WS /v1/tracking — real-time location",
      ],
    },
    {
      title: "Data Flow",
      content: [
        "1. Rider sends ride request via mobile app",
        "2. API Gateway routes to Ride Service",
        "3. Ride Service publishes event to Matching queue",
        "4. Matching Service finds nearest driver via geospatial index",
        "5. Driver receives push notification",
        "6. Driver accepts → Ride Service updates status",
      ],
    },
    {
      title: "High-Level Design",
      content: [
        "Client → API Gateway → Ride Service → Postgres",
        "Matching Service → Redis (geospatial)",
        "Kafka for async events",
        "WebSocket for real-time tracking",
      ],
    },
    {
      title: "Deep Dives",
      content: [
        "Real-time location tracking via WebSocket + Redis GEOSEARCH",
        "Surge pricing based on supply/demand ratio per geo cell",
        "Matching algorithm: nearest driver with ETA weighting",
      ],
    },
  ],
};

export default uber;
