
export const formatCallDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600); 
    const minutes = Math.floor((seconds % 3600) / 60); 
    const secs = seconds % 60;

    const formattedTime = [
      hours > 0 ? String(hours).padStart(2, "0") : null, 
      String(minutes).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter((time) => time !== null)
      .join(":"); 
  
    return formattedTime;
  }