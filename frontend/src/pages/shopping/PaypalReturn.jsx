import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const PaypalReturn = () => {
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState("Processing payment...");

   useEffect(() => {
      axios.get("/user/order/capture")
         .then(response => {
          setMessage("Payment processed successfully!");
         })
         .catch(error => {
          console.error("Error processing payment:", error);
          setMessage("Error processing payment. Please try again.");
         })
         .finally(() => setLoading(false))
   }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{message}</CardTitle>
      </CardHeader>
      <CardContent>
       { loading ? <Loader2/> :  <p>Thank you for your purchase!</p>}
      </CardContent>
    </Card>
  );
};

export default PaypalReturn;