package br.com.patio.pricing;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pricing")
public class PricingConfigController {

    private final PricingConfigService service;

    public PricingConfigController(PricingConfigService service) {
        this.service = service;
    }

    @GetMapping
    public PricingConfigResponse get() {
        return service.getResponse();
    }

    @PutMapping
    public PricingConfigResponse update(@Valid @RequestBody PricingConfigRequest request) {
        return service.update(request);
    }
}
