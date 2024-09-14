import React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";

const Product = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Supply Left: {supply}</Typography>
          {stat && (
            <>
              <Typography>
                Yearly Sales This Year: {stat.yearlySalesTotal}
              </Typography>
              <Typography>
                Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}
              </Typography>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  
  const products = Array. useGetProductsQuery();
  const productStats = Array.isArray(dataProductStat) ? dataProductStat : [];
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  // Map stats to products
  const productsWithStats = products.map(product => {
    const stat = productStats.find(stat => stat.productId === product._id);
    return { ...product, stat };
  });

  if (productsWithStats.length === 0) {
    return <Typography>No products available.</Typography>;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="NODES" subtitle="See your list of nodes." />
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        justifyContent="space-between"
        rowGap="20px"
        columnGap="1.33%"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {productsWithStats.map(
          ({
            _id,
            name,
            description,
            price,
            rating,
            category,
            supply,
            stat,
          }) => (
            <Product
              key={_id}
              _id={_id}
              name={name}
              description={description}
              price={price}
              rating={rating}
              category={category}
              supply={supply}
              stat={stat}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default Products;
