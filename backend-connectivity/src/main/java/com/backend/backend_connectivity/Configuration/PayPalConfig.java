package com.backend.backend_connectivity.Configuration;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.OAuthTokenCredential;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class PayPalConfig {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;  // "sandbox" or "live"

    /**
     * SDK configuration map
     */
    @Bean
    public Map<String, String> paypalSdkConfig() {
        Map<String, String> configMap = new HashMap<>();
        configMap.put("mode", mode);
        return configMap;
    }

    /**
     * Returns OAuth token credential used for PayPal API authentication.
     */
    @Bean
    public OAuthTokenCredential oAuthTokenCredential() {
        return new OAuthTokenCredential(clientId, clientSecret, paypalSdkConfig());
    }

    /**
     * Builds the APIContext bean used by the PayPal SDK.
     */
    @Bean
    public APIContext apiContext() throws PayPalRESTException {
        String accessToken = oAuthTokenCredential().getAccessToken();
        APIContext context = new APIContext(accessToken);
        context.setConfigurationMap(paypalSdkConfig());
        return context;
    }
}
