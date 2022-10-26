package com.kezuler.api;

import com.kezuler.common.ResponseSet;
import com.kezuler.config.security.UserDetailsImpl;
import com.kezuler.domain.Participants;
import com.kezuler.dto.EventDto;
import com.kezuler.service.CalendarService;
import com.kezuler.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/fixedEvents")
@RequiredArgsConstructor
public class FixedController {

    private final EventService eventService;
    private final CalendarService calendarService;

    // 해당 유저가 속한 전체 리스트
    @GetMapping
    public ResponseEntity<?> getEvents(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                 @RequestParam(value = "page", defaultValue = "0") int page) {
        log.info(" Enter -> [ FixedController @GET /fixedEvents ] {}", userDetails.getAccount().getName());
//        PageRequest pageRequest = PageRequest.of(page, 15);
//        List<EventDto.GetFixed> fixeds = eventService.getFixeds(userDetails, pageRequest);
        List<EventDto.GetFixed> fixeds = eventService.getFixeds(userDetails, page);
        ResponseSet responseSet = new ResponseSet(fixeds);
        return new ResponseEntity<>(responseSet, HttpStatus.OK);
//        List<EventDto.GetFixed> fixeds = eventService.getFixeds(userDetails);
//        ResponseSet responseSet = new ResponseSet(fixeds);
//        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @GetMapping("/next")
    public ResponseEntity<ResponseSet> getEventsHasNext(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                       @RequestParam(value = "page", defaultValue = "0") int page) {
        log.info(" Enter -> [ FixedController @GET /fixedEvents/next ] {}", userDetails.getAccount().getName());

        int count = eventService.getFixedsNextCount(userDetails, page);
        ResponseSet responseSet = new ResponseSet(count);
        return new ResponseEntity<>(responseSet, HttpStatus.OK);

    }

    // 이벤트 단일
    @GetMapping("/{eventId}")
    public ResponseEntity<ResponseSet> getEvent(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                @PathVariable String eventId) {
        log.info(" Enter -> [ FixedController @GET /fixedEvents/{} ]", eventId);
        EventDto.GetFixed fixed = eventService.getFixed(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet(fixed);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // 호스트가 미팅 확정하기
    @PostMapping
    public ResponseEntity<ResponseSet> fixedEvent(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                  @RequestBody @Valid EventDto.Fixed eventDto) {
        log.info(" Enter -> [ FixedController @Post /fixedEvents ] {}", userDetails.getAccount().getName());

        eventService.confirmByHost(userDetails, eventDto);
        calendarService.insertEventByHost(userDetails, eventDto.getPendingEventId());
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // event 정보 수정 및 취소
    @PatchMapping("/{eventId}")
    public ResponseEntity<ResponseSet> updateEvent(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                   @PathVariable String eventId,
                                                   @RequestBody @Valid EventDto.Update eventDto) {
        log.info(" Enter -> [ FixedController @Patch /pendingEvents/{eventId} ] {}", eventId);
        ResponseSet responseSet = null;

        log.info("  eventTitle : {}", eventDto.getEventTitle());
        log.info("  addressType : {}", eventDto.getAddressType());
        log.info("  addressDetail : {}", eventDto.getAddressDetail());
        log.info("  eventAttachment : {}", eventDto.getEventAttachment());
        eventDto.setEventId(eventId);
        EventDto.GetFixed getFixed = eventService.updateFixedEvent(userDetails, eventDto);
        responseSet = new ResponseSet(getFixed);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // 게스트 재참여
    @PutMapping("/{eventId}/candidate")
    public ResponseEntity<ResponseSet> insertGuestSelectTime(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                             @PathVariable String eventId) {
        log.info(" Enter -> [ PendingController @Put /pendingEvents/{eventId}/candidate ] {}", eventId);
        EventDto.GetFixed getFixed = eventService.reattendFixedEventByGuest(userDetails, eventId);
        if (userDetails.getAccount().isGoogleCalendarToggle()) {
            calendarService.insertEventByReattenedGuest(userDetails, eventId);
        }
        ResponseSet responseSet = new ResponseSet(getFixed);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }
    // 게스트 삭제
    @DeleteMapping("/{eventId}/candidate")
    public ResponseEntity<ResponseSet> insertGuestDecline(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                          @PathVariable String eventId) {
        log.info(" Enter -> [ PendingController @Delete /pendingEvents/{eventId}/candidate ] {}", eventId);
        EventDto.GetFixed getFixed = eventService.deleteFixedEventByGuest(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet(getFixed);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // 게스트 취소
    @PatchMapping("/{eventId}/candidate")
    public ResponseEntity<ResponseSet> cancelEventByGuest(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                          @PathVariable String eventId) {
        log.info(" Enter -> [ PendingController @Put /pendingEvents/{eventId}/candidate ] {}", eventId);
        EventDto.GetFixed getFixed = eventService.cancelFixedEventByGuest(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet(getFixed);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // 호스트 취소
    @PatchMapping("/{eventId}/host")
    public ResponseEntity<ResponseSet> cancelEventByHost(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                         @PathVariable String eventId){
        log.info(" Enter -> [ EventController @Patch /events/host/{eventId} ] {}", eventId);

        EventDto.GetFixed getFixed = eventService.cancelFixedEventByHost(userDetails, eventId);
        calendarService.cancelEventByHost(eventId);
        ResponseSet responseSet = new ResponseSet(getFixed);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    // 호스트 삭제
    @DeleteMapping("/{eventId}/host")
    public ResponseEntity<ResponseSet> deleteEventByHost(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                         @PathVariable String eventId){
        log.info(" Enter -> [ EventController @DELETE /events/host/{eventId} ] {}", eventId);

        eventService.deleteFixedEventByHost(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @PatchMapping("/{eventId}/reminder")
    public ResponseEntity<ResponseSet> changeReminder(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                      @PathVariable String eventId,
                                                      @RequestBody @Valid EventDto.Reminder eventDto){
        log.info(" Enter -> [ EventController @Patch /fixedEvents/{eventId}/reminder ] {}", eventId);
        eventService.updateReminder(userDetails, eventId, eventDto);
        ResponseSet responseSet = new ResponseSet();
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }

    @GetMapping("/{eventId}/reminder")
    public ResponseEntity<ResponseSet> getReminder(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                      @PathVariable String eventId){
        log.info(" Enter -> [ FixedController @GET /fixedEvents/{eventId}/reminder ] {}", eventId);
        long reminder = eventService.getReminder(userDetails, eventId);
        ResponseSet responseSet = new ResponseSet(reminder);
        return new ResponseEntity<ResponseSet>(responseSet, HttpStatus.OK);
    }
}
