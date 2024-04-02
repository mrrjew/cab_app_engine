import IService, { IAppContext } from '../types/app';
import { google } from 'googleapis';
import { Server } from 'socket.io';
import config from '../config';
import axios from 'axios';

export default class RideService extends IService {
  private io: Server;

  constructor(props: IAppContext, httpServer: any) {
    super(props);
    this.io = new Server(httpServer);
    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  private async calculateDistance(origin: string, destination: string) {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${config.maps.api_key}`;
      const response = await axios.get(apiUrl);
      const distance = response.data.rows[0].elements[0].distance;
      const time = response.data.rows[0].elements[0].duration;
      console.log(`Distance from ${origin} to ${destination}: ${distance.text} in ${time.text}`);
      return {distance,time};
    } catch (error) {
      console.error('Error fetching distance:', error);
      throw new Error('Error fetching distance');
    }
  }

  private async findAvailableDrivers(origin: string) {
    try {
      const response = await axios.get('http://localhost:8080/driver/get-closer-drivers', {
        params: { origin },
      });

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async requestRide(req: any, res: any) {
    const user = await this.authenticate_rider(req.user._id);

    if (!user) {
      return res.status(404).send('User not authenticated');
    }

    const { pickupLocation, destination } = req.body;

    if (!pickupLocation || !destination) {
      return res.status(400).send('Missing required fields');
    }

    try {
       const origin = `${pickupLocation.latitude},${pickupLocation.longitude}`;
       const dest = `${destination.latitude},${destination.longitude}`;

      const response = await this.calculateDistance(origin, dest);

      const ride = await this.models.Ride.create({
        rider: req.user._id,
        pickupLocation,
        destination,
        distance: { text: response.distance.text, value: response.distance.value },
        duration: { text: response.time.text, value: response.time.value },
        mileage: +response.distance.value * 0.000621371,
      });

      await ride.save();

      this.io.emit('newRide', { message: 'New ride request', ride });

      return res.status(201).json({ message: 'Ride created', ride });
    } catch (error) {
      console.error('Error creating ride:', error.message);
      return res.status(500).send('Error creating ride');
    }
  }

  async assignDriver(req: any, res: any) {
    const { _id, pickupLocation } = req.body;

    try {
      const availableDrivers = await this.findAvailableDrivers(pickupLocation);

      const driversWithDistance = await Promise.all(
        availableDrivers.map(async (driver: any) => {
          const distance = await this.calculateDistance(driver.location, pickupLocation);
          return { driver, distance };
        })
      );

      driversWithDistance.sort((a, b) => a.distance - b.distance);

      const closestDriver = driversWithDistance[0].driver;

      await this.models.Ride.findByIdAndUpdate(_id, { driver: closestDriver });
      return res.status(200).send('Driver assigned successfully');
    } catch (error) {
      console.error('Error assigning driver:', error);
      return res.status(500).send('Error assigning driver');
    }
  }

  async updateRide(req: any, res: any) {
    try {
      const ride = await this.authenticate_ride(req.params.id);

      await ride.updateOne({ $set: { ...req.body } }, { new: true, upsert: true });

      await ride.save();
      return res.status(200).send('Edited ride successfully');
    } catch (error) {
      console.error('Error editing ride:', error);
      return res.status(500).send(`Error editing ride: ${error}`);
    }
  }

  async deleteRide(req: any, res: any) {
    try {
      const ride = await this.authenticate_ride(req.params.id);

      await ride.deleteOne();

      return res.status(200).send('Deleted ride successfully');
    } catch (error) {
      console.error('Error deleting ride:', error);
      return res.status(500).send(`Error deleting ride: ${error}`);
    }
  }
}
