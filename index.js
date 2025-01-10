// import express from 'express';
// // import connectDB from "./config/connection";
// // import authRoutes from './routes/authRoutes';
// // import serviceRoutes from './routes/services';

// import cors from 'cors';

// const app = express();
// const port = 3000; // Change to another port if needed

// app.use(cors({
//     origin: "http://localhost:5173" // Change this to your frontend URL
// }));

// const services = [
//     {
//         id: 1,
//         name: "Haircut",
//         description: "A stylish haircut to match your personality.",
//         price: 25,
//         imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVIUnDmHEO1roVD0uMfFibbp8F5gGjxy_ZEQ&s"
//     },
//     {
//         id: 2,
//         name: "Manicure",
//         description: "Pamper your hands with our manicure service.",
//         price: 15,
//         imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3ZW7hwN9joClElp8kNyzKJmK79vGeusZMkg&s"
//     },
//     {
//         id: 3,
//         name: "Pedicure",
//         description: "Relax and rejuvenate with our pedicure treatment.",
//         price: 20,
//         imageUrl: "https://media.istockphoto.com/id/1167658687/photo/professional-doing-pedicure-of-customer-at-spa.jpg?s=612x612&w=0&k=20&c=itTbRFNTWdTF6simoWuRCV3M_Z_0K9HFSHsMTS3T98o="
//     },
//     {
//         id: 4,
//         name: "Facial",
//         description: "Refresh your skin with our nourishing facial treatment.",
//         price: 30,
//         imageUrl:"https://t3.ftcdn.net/jpg/02/56/55/26/360_F_256552697_h7Dg5cnsfzbyZZ66RKddjBPNxQvGdXuA.jpg"
//     },
//     {
//         id: 5,
//         name: "Hair Coloring",
//         description: "A full hair color to enhance your beauty.",
//         price: 75,
//         imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPE8XXVW43Fp_LraP1sjGG5WPKKY6I3Hc3yg&s"

//     },
//     {
//         id: 6,
//         name: "Updo Styling",
//         description: "Elegant updo hairstyles for special occasions.",
//         price: 50,
//         imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjeK78GQ08r9tyW0skPnK0apDarUjzcZxFKQ&s"
//     }

// ];


// // app.use('/api/authRoutes', authRoutes);
// // app.use('/api/services', serviceRoutes); 

// app.use(express.json());

// app.get('/',(req,res)=>{
//     res.send('welcome to the api');
// })

// app.get('/services', (req, res) => {
//     res.json(services);
//     console.log('Request made to /services');
// });

// app.listen(port, () => {
//     console.log(`Server is listening on ${port}`);
// }).on('error', (err) => {
//     console.error(`Error starting server: ${err}`);
// });
