test_instn = sample(nrow(Census), 0.2*nrow(Census))
Census_test = Census[test_instn,] 
Census_train = Census[-test_instn,] 

reg_lin = lm(Census$NumberPolicies~Census$POPESTIMATE2014 + Census$RedBlue 
            + Census$CoalP2014 + factor(Census$Division) + Census$CoalC2014
             + Census$co2_capita + Census$co2_2014 + Census$HydroP2014 + Census$GeoP2014 
            + Census$HydroC2010 + Census$NatGasC2014 + Census$GeoC2014
            )

summary(reg_lin)

summary(lm(NumberPolicies~RedBlue+POPESTIMATE2014+ElecPrice2014+GDP2014+CoalP2014+LPGPrice2014, data = Census))

xpol_sum <- predict(reg_lin)
rmse = sqrt(mean((Census$NumberPolicies-pol_sum)^2))

rmse

RSS <- c(crossprod(reg_lin$residuals))
MSE <- RSS / length(reg_lin$residuals)
RMSE <- sqrt(MSE)
RMSE

sum(Census$NumberPolicies)
sum(pol_sum)



nnet.fit <- nnet( Census$co2_capita/max(Census$co2_capita)~Census$POPESTIMATE2014 + Census$RedBlue 
                  + Census$GDP2014 + Census$LPGPrice2014 + factor(Census$Division) + Census$CoalP2014 
                  + Census$ElecPrice2014 + Census$NatGasPrice2014, size=100, decay = 0, maxit=4000, MaxNWts = 2500)
nnet.predict <- predict(nnet.fit)*max(Census$co2_capita)

mean((nnet.predict - Census$co2_capita)^2)


library(mlbench)
require(caret)
mygrid <- expand.grid(.decay=c(0.5, 0.1), .size=c(4,5,6))
nnetfit <- train(NumberPolicies/256 ~ POPESTIMATE2014 + RedBlue 
                 + GDP2014 + LPGPrice2014 + factor(Division) + CoalP2014 + ElecPrice2014 + NatGasPrice2014, data = Census, method="nnet", maxit=1000, tuneGrid=mygrid, trace=F) 
print(nnetfit)

lmfit <- train(NumberPolicies/256 ~ POPESTIMATE2014 + RedBlue 
               + GDP2014 + LPGPrice2014 + factor(Division) + CoalP2014 + ElecPrice2014 + NatGasPrice2014, data=Census, method="lm") 
print(lmfit)
