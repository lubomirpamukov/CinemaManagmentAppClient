import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import type { THallSeat, TCreateReservation } from "../validations";
import { makeStyles } from "@mui/styles";
import SelecDateAndSeatQuantity from "../components/booking/SelectDateAndSeatQuantity";

import styles from "./BookingPage.module.css";
import SelectCityStep from "../components/booking/SelectCityStep";
import SelectCinemaAndSnacksStep, {
  type SelectedSnackInfo,
} from "../components/booking/SelectCinemaAndSnacksStep";
import SelectSessionStep from "../components/booking/SelectSessionStep";
import SelectSeatsStep from "../components/booking/SelectSeatsStep";
import ConfirmReservation from "../components/booking/ConfirmReservationStep";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useAuth } from "../hooks";
import { createReservation } from "../services/reservationService";

const useStyles = makeStyles(() => ({
  stepper: {
    "& .MuiStepIcon-root": {
      color: "var(--color-muted)",
    },
    "& .MuiStepIcon-root.Mui-active": {
      color: "var(--color-secondary)",
    },
    "& .MuiStepIcon-root.Mui-completed": {
      color: "var(--color-highlight)",
    },
  },
}));

const steps = [
  "Select City",
  "Select Cinema & Snacks",
  "Select Date",
  "Available Sessions",
  "Pick Your Seats",
  "Confirm Reservation",
];

type BookingData = {
  movieId?: string | null;
  userId?: string | null;
  movieName?: string | null;
  city?: string | null;
  cinemaId?: string | null;
  cinemaName?: string | null;
  hallName?: string | null;
  date?: Date | null;
  sessionTime?: string | null;
  numberOfSeats?: number;
  selectedSessionId?: string | null;
  selectedSeats?: THallSeat[];
  selectedSnacks?: Record<string, SelectedSnackInfo>; // Added selectedSnacks
};

const BookingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    movieId: null,
    city: null,
    cinemaId: null,
    date: null,
    numberOfSeats: 1,
    selectedSessionId: null,
    selectedSeats: [], // Will store TSeat objects
    selectedSnacks: {},
  });

  const { user } = useAuth();
  const { movieId: routeMovieId } = useParams<{ movieId: string }>();
  const { movie } = useMovieDetails(bookingData.movieId);
  const navigate = useNavigate();

  useEffect(() => {
    if (movie && movie.title && bookingData.movieName !== movie.title) {
      setBookingData((prev) => ({ ...prev, movieName: movie.title }));
    }
  }, [movie]);

  useEffect(() => {
    if (user?.id) {
      setBookingData((prev) => ({ ...prev, userId: user.id }));
    }
  }, [user?.id]);

  useEffect(() => {
    if (routeMovieId) {
      setBookingData((prev) => ({ ...prev, movieId: routeMovieId }));
    }
  }, [routeMovieId]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setBookingData({
      movieId: bookingData.movieId,
      movieName: bookingData.movieName,
      city: null,
      cinemaId: null,
      date: null,
      numberOfSeats: 1,
      selectedSessionId: null,
      selectedSeats: [],
      selectedSnacks: {},
    });
  };
  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SelectCityStep
            movieId={bookingData.movieId!}
            selectedCity={bookingData.city!}
            onSelect={(city) =>
              updateBookingData({
                city,
                cinemaId: null,
                selectedSnacks: {},
                date: null,
                selectedSessionId: null,
                selectedSeats: [],
              })
            }
          />
        );
      case 1:
        return (
          <SelectCinemaAndSnacksStep
            movieId={bookingData.movieId!}
            city={bookingData.city!}
            selectedCinemaId={bookingData.cinemaId!}
            onCinemaSelect={(cinemaId, cinemaName) =>
              updateBookingData({
                cinemaId,
                cinemaName,
                selectedSnacks: {},
                date: null,
                selectedSessionId: null,
                selectedSeats: [],
              })
            }
            selectedSnacks={bookingData.selectedSnacks || {}}
            onSnacksUpdate={(updatedSnacks) =>
              updateBookingData({ selectedSnacks: updatedSnacks })
            }
          />
        );
      case 2:
        return (
          <SelecDateAndSeatQuantity
            movieId={bookingData.movieId!}
            cinemaId={bookingData.cinemaId!}
            selectedDate={bookingData.date!}
            numberOfSeats={bookingData.numberOfSeats || 1}
            onDateChange={(date) =>
              updateBookingData({
                date,
                selectedSessionId: null,
                selectedSeats: [],
              })
            }
            onSeatsChange={(seats) =>
              updateBookingData({
                numberOfSeats: seats,
                selectedSessionId: null,
                selectedSeats: [],
              })
            }
          />
        );
      case 3:
        return (
          <SelectSessionStep
            movieId={bookingData.movieId}
            cinemaId={bookingData.cinemaId}
            date={bookingData.date}
            numberOfSeats={bookingData.numberOfSeats}
            selectedSessionId={bookingData.selectedSessionId}
            onSessionSelect={(sessionId, hallName, startTime) =>
              updateBookingData({
                selectedSessionId: sessionId,
                hallName,
                sessionTime: startTime,
                selectedSeats: [],
              })
            }
          />
        );
      case 4:
        return (
          <SelectSeatsStep
            sessionId={bookingData.selectedSessionId!}
            selectedSeats={(bookingData.selectedSeats || []).map(
              (seat) => seat._id as string
            )}
            onSeatSelect={(seat) => {
              const updatedData = ((prev: BookingData) => {
                const alreadySelected = prev.selectedSeats?.some(
                  (s) => s._id === seat._id
                );
                return {
                  selectedSeats: alreadySelected
                    ? prev.selectedSeats?.filter((s) => s._id !== seat._id)
                    : [...(prev.selectedSeats || []), seat],
                };
              })(bookingData);

              updateBookingData(updatedData);
            }}
          />
        );
      case 5:
        return (
          <ConfirmReservation
            movieName={bookingData.movieName!}
            cinemaName={bookingData.cinemaName || "Generic Cinema"}
            hallName={bookingData.hallName || "Main Hall"}
            date={bookingData.date}
            sessionTime={bookingData.sessionTime || "time undefined"}
            selectedSeats={bookingData.selectedSeats || []}
            selectedSnacks={bookingData.selectedSnacks || {}}
            totalTicketPrice={(bookingData.selectedSeats || []).reduce(
              (sum, seat) => sum + seat.price,
              0
            )}
            onConfirm={async () => {
              const snackQuantities: Record<string, number> =
                Object.fromEntries(
                  Object.entries(bookingData.selectedSnacks ?? {}).map(
                    ([id, snackInfo]) => [id, snackInfo.quantity]
                  )
                );

              const reservationPayload: TCreateReservation = {
                userId: bookingData.userId!,
                sessionId: bookingData.selectedSessionId!,
                status: "pending",
                seats: (bookingData.selectedSeats || []).map((seat) => ({
                  originalSeatId: seat._id!,
                })),
                purchasedSnacks: snackQuantities,
              };

              try {
                await createReservation(reservationPayload);
                navigate("/bookings");
              } catch (error: any) {
                return <div className={styles.errorContainer}>{error}</div>;
              }
            }}
          />
        );
    }
  };

  const classes = useStyles();
  return (
    <Paper elevation={3} className={styles.bookingContainer}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className={styles.pageTitle}
      >
        Book Your Tickets
      </Typography>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box className={styles.contentBox}>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished (or show booking
              summary)
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset} className={styles.resetButton}>
                Reset
              </Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box
              sx={{
                mt: 2,
                mb: 2,
                p: 2,
                // border: "1px dashed grey", // You can keep or remove this styling
                borderRadius: "4px",
              }}
            >
              {getStepContent(activeStep)}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  if (activeStep === 0) {
                    navigate(-1)
                  } else {
                    handleBack();
                  }
                }}
                className={styles.navButton}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
                className={styles.navButton}
                // Add logic to disable Next if required fields for the current step are not filled
                disabled={
                  (activeStep === 0 && !bookingData.city) ||
                  (activeStep === 1 && !bookingData.cinemaId) ||
                  (activeStep === 2 &&
                    (!bookingData.date || !bookingData.numberOfSeats)) ||
                  (activeStep === 3 && !bookingData.selectedSessionId) ||
                  (activeStep === 4 &&
                    (!bookingData.selectedSeats ||
                      bookingData.selectedSeats.length === 0))
                }
              >
                {activeStep === steps.length - 1 ? "Reset" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Paper>
  );
};

export default BookingPage;
