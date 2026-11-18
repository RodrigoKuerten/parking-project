package br.com.patio.pricing;

import br.com.patio.shared.ResourceNotFoundException;
import java.time.Clock;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PricingConfigService {

    private final PricingConfigRepository repository;
    private final Clock clock;

    public PricingConfigService(PricingConfigRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public PricingConfig get() {
        return repository.findById(PricingConfig.SINGLETON_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing configuration not found."));
    }

    @Transactional(readOnly = true)
    public PricingConfigResponse getResponse() {
        return PricingConfigResponse.from(get());
    }

    @Transactional
    public PricingConfigResponse update(PricingConfigRequest request) {
        PricingConfig config = get();
        config.update(
                request.firstHourRate(),
                request.additionalHourRate(),
                request.dailyRate(),
                request.graceMinutes(),
                request.roundingMinutes(),
                LocalDateTime.now(clock)
        );
        return PricingConfigResponse.from(config);
    }
}
