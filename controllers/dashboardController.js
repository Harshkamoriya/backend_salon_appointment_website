import Appointment from "../models/Appointment.js";
import Service from "../models/service.js";
// Route: GET /api/dashboard/revenue
const getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Appointment.aggregate([
      {
        $lookup: {
          from: "services", // Name of the Service collection (lowercase plural in MongoDB)
          localField: "service", // Field in Appointment model that matches the Service name
          foreignField: "name", // Field in Service model to match
          as: "serviceDetails", // Output array
        },
      },
      { $unwind: "$serviceDetails" }, // Deconstruct the serviceDetails array
      {
        $group: {
          _id: null,
          total: { $sum: "$serviceDetails.price" }, // Sum up the price field from Service
        },
      },
    ]);

    res.json({ totalRevenue: totalRevenue[0]?.total || 0 });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getTotalAppointments = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    res.json({ totalAppointments });
  } catch (error) {
    console.error('error:'+error.message);
    res.status(500).json({ message: "Server Error", error });
  }
};


// Route: GET /api/dashboard/popular-service
// const getMostPopularService = async (req, res) => {
//   try {
//     const popularService = await Appointment.aggregate([
//       { $group: { _id: "$service", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 1 }
//     ]);
//     res.json({ mostPopularService: popularService[0]?._id || "No Data" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

const getMostPopularService = async (req, res) => {
  try {
    const popularService = await Appointment.aggregate([
      { $match: { service: { $exists: true, $ne: null } } }, // Ensure `service` field exists and is not null
      { $group: { _id: "$service", count: { $sum: 1 } } },   // Group by `service` and count occurrences
      { $sort: { count: -1 } },                             // Sort by count in descending order
      { $limit: 1 }                                         // Get the top service
    ]);

    // Check if aggregation result is empty
    if (popularService.length > 0) {
      res.json({ mostPopularService: popularService[0]._id });
    } else {
      res.json({ mostPopularService: "No Data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



const getNewCustomers =async (req, res)=>{
  try {
    // Get current date
    const today = new Date();
    
    // Helper functions to get start of day, week, and month
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of week (Sunday)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of month

    // Daily New Customers
    const dailyNewCustomers = await Appointment.aggregate([
      { $match: { date: { $gte: startOfDay.toISOString().split("T")[0] } } },
      { $group: { _id: "$contact" } }, // Group by unique contact
      { $count: "dailyCount" }
    ]);

    // Weekly New Customers
    const weeklyNewCustomers = await Appointment.aggregate([
      { $match: { date: { $gte: startOfWeek.toISOString().split("T")[0] } } },
      { $group: { _id: "$contact" } },
      { $count: "weeklyCount" }
    ]);

    // Monthly New Customers
    const monthlyNewCustomers = await Appointment.aggregate([
      { $match: { date: { $gte: startOfMonth.toISOString().split("T")[0] } } },
      { $group: { _id: "$contact" } },
      { $count: "monthlyCount" }
    ]);

    // Extract counts (default to 0 if no data)
    const dailyCount = dailyNewCustomers[0]?.dailyCount || 0;
    const weeklyCount = weeklyNewCustomers[0]?.weeklyCount || 0;
    const monthlyCount = monthlyNewCustomers[0]?.monthlyCount || 0;

    // Send response
    res.json({
      dailyNewCustomers: dailyCount,
      weeklyNewCustomers: weeklyCount,
      monthlyNewCustomers: monthlyCount
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error });
  }
}

const getAppointmentsChart = async (req, res) => {
  try {
    const chartData = await Appointment.aggregate([
      {
        $addFields: {
          date: { $toDate: "$date" }, // Convert the 'date' field from string to Date
        },
      },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                  day: { $dayOfMonth: "$date" },
                },
                total: { $sum: 1 }, // Count total appointments
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
          ],
          weekly: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  week: { $week: "$date" },
                },
                total: { $sum: 1 }, // Count total appointments
              },
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } },
          ],
          monthly: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                },
                total: { $sum: 1 }, // Count total appointments
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
          yearly: [
            {
              $group: {
                _id: { year: { $year: "$date" } },
                total: { $sum: 1 }, // Count total appointments
              },
            },
            { $sort: { "_id.year": 1 } },
          ],
        },
      },
    ]);
            console.log(chartData);
    // Send the response
    res.json(chartData[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error });
  }
};
const getNewCustomersChart = async (req, res) => {
  try {
    const chartData = await Appointment.aggregate([
      {
        $addFields: {
          date: { $toDate: "$date" }, // Convert the 'date' field from string to Date
        },
      },
      {
        $group: {
          _id: "$contact", // Group by unique customer identifier (e.g., contact)
          firstAppointmentDate: { $min: "$date" }, // Get the first appointment date for each customer
        },
      },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  year: { $year: "$firstAppointmentDate" },
                  month: { $month: "$firstAppointmentDate" },
                  day: { $dayOfMonth: "$firstAppointmentDate" },
                },
                total: { $sum: 1 }, // Count distinct new customers
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
          ],
          weekly: [
            {
              $group: {
                _id: {
                  year: { $year: "$firstAppointmentDate" },
                  week: { $week: "$firstAppointmentDate" },
                },
                total: { $sum: 1 }, // Count distinct new customers
              },
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } },
          ],
          monthly: [
            {
              $group: {
                _id: {
                  year: { $year: "$firstAppointmentDate" },
                  month: { $month: "$firstAppointmentDate" },
                },
                total: { $sum: 1 }, // Count distinct new customers
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
          yearly: [
            {
              $group: {
                _id: { year: { $year: "$firstAppointmentDate" } },
                total: { $sum: 1 }, // Count distinct new customers
              },
            },
            { $sort: { "_id.year": 1 } },
          ],
        },
      },
    ]);
 console.log(chartData)
    // Send the response
    res.json(chartData[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error });
  }
};





const getRevenueChart = async (req, res) => {
  try {
    const chartData = await Appointment.aggregate([
      {
        $addFields: {
          date: { $toDate: "$date" } // Convert the 'date' field from string to Date
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "name",
          as: "serviceDetails",
        },
      },
      {
        $unwind: {
          path: "$serviceDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $facet: {
          daily: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                  day: { $dayOfMonth: "$date" },
                },
                total: { $sum: "$serviceDetails.price" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
          ],
          weekly: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  week: { $week: "$date" },
                },
                total: { $sum: "$serviceDetails.price" },
              },
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } },
          ],
          monthly: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                },
                total: { $sum: "$serviceDetails.price" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
          yearly: [
            {
              $group: {
                _id: { year: { $year: "$date" } },
                total: { $sum: "$serviceDetails.price" },
              },
            },
            { $sort: { "_id.year": 1 } },
          ],
        },
      },
    ]);
    console.log(chartData);

    

    // Send the response
    res.json(chartData[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error", error });
  }
};



export { getTotalRevenue , getTotalAppointments ,getNewCustomers, getMostPopularService , getNewCustomersChart , getAppointmentsChart,getRevenueChart};
