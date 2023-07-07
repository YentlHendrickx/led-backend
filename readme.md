# LED System Backend

This Node.js backend is designed to control an LED system and provide a simple REST API for controlling the LEDs. It also utilizes MQTT to notify clients when they should make a new API request.

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (version 12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the source code:

```bash
   git clone https://github.com/YentlHendrickx/led-backend.git
```

2. Navigate to the project directory:

```bash
   cd led-backend
```

3. Install the dependencies:

```bash
   npm install
```

## Configuration

Before running the backend, you may need to configure a few settings. Update the following configuration files:

### `.env.default`

- Change the name to .env
- Set the database user, host, name, password and port
- Set the MQTT broker's host and port.

## Usage

To start the LED system backend, run the following command (from the main directory):

```bash
node lib/index.js
```

The backend will now be running on `http://localhost:4000`.

## MQTT Notifications

The backend publishes MQTT messages to the following topics:

### `leds/updates`

When the status of any LED is updated, a message is published to this topic. Clients can subscribe to this topic to receive real-time notifications about LED status changes.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request to the [GitHub repository](https://github.com/YentlHendrickx/led-backend).

## License

This project is licensed under the [MIT License](https://www.mit.edu/~amini/LICENSE.md). Feel free to use and modify this code for your own purposes.
