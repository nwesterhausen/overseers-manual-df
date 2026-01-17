use tauri::{AppHandle, Emitter};
use tracing::{Event, Subscriber};
use tracing_subscriber::layer::Context;
use tracing_subscriber::Layer;

use crate::shared_structs::ParsingEventPayload;

/// Layer for 'tracing' which extracts the event and emits the message as a `PARSING_LOG_EVENT`
pub struct TauriTracingLayer {
    /// The tauri app handle so we can emit events
    pub app_handle: AppHandle,
}
pub const PARSING_LOG_EVENT: &str = "parsing-log";

impl<S: Subscriber> Layer<S> for TauriTracingLayer {
    // extracts the log event from the tracing log. will grab the message if one exists
    // and emit it as an event for our frontend.
    fn on_event(&self, event: &Event<'_>, _ctx: Context<'_, S>) {
        let mut visitor = MessageVisitor::default();
        event.record(&mut visitor);

        if let Some(message) = visitor.message {
            let _ = self.app_handle.emit(
                PARSING_LOG_EVENT,
                ParsingEventPayload {
                    level: event.metadata().level().to_string(),
                    message,
                },
            );
        }
    }
}

// Helper to extract the string message from tracing fields
#[derive(Default)]
struct MessageVisitor {
    message: Option<String>,
}

impl tracing::field::Visit for MessageVisitor {
    fn record_debug(&mut self, field: &tracing::field::Field, value: &dyn std::fmt::Debug) {
        if field.name() == "message" {
            self.message = Some(format!("{:?}", value));
        }
    }
}
